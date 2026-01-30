import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

const ai = new GoogleGenAI({});

export async function POST(request: NextRequest) {
  const { sourceId, libraryId, fileUrl } = await request.json();

  console.log(
    `Processing document. SourceId: ${sourceId}, FileUrl: ${fileUrl}`,
  );

  if (!fileUrl) {
    console.error("Missing fileUrl");
    return Response.json(
      { success: false, error: "Missing fileUrl" },
      { status: 400 },
    );
  }

  try {
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }
    const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());
    const fileType =
      fileResponse.headers.get("content-type") || "application/pdf";

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: "Provide a comprehensive summary of this document in 3-5 paragraphs. Include the main topics, key points, and any important conclusions or findings.",
        },
        {
          inlineData: {
            mimeType: fileType,
            data: fileBuffer.toString("base64"),
          },
        },
      ],
    });

    const summary = result.text;

    await prisma.source.update({
      where: { id: sourceId },
      data: {
        status: "COMPLETED",
        summary,
      },
    });

    await generateLibrarySummary(libraryId);

    return Response.json({ success: true, summary });
  } catch (error) {
    console.error("Error processing document:", error);
    await prisma.source.update({
      where: { id: sourceId },
      data: {
        status: "FAILED",
        processingError:
          error instanceof Error ? error.message : "Unknown error",
      },
    });
    return Response.json(
      { success: false, error: "Processing failed" },
      { status: 500 },
    );
  }
}

async function generateLibrarySummary(libraryId: string) {
  const sources = await prisma.source.findMany({
    where: {
      libraryId: libraryId,
      status: "COMPLETED",
      summary: { not: null },
    },
    select: { fileName: true, summary: true },
  });

  const combinedText = sources
    .map((s, i) => `Document ${i + 1} - ${s.fileName}:\n${s.summary}`)
    .join("\n\n");

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: `You are analyzing a collection of ${sources.length} documents. Here are the individual summaries:\n\n${combinedText}\n\nBased on all these documents, provide a comprehensive overview that:\n1. Identifies common themes across documents\n2. Highlights key insights\n3. Provides an executive summary of the entire collection\n\nKeep it concise (4-6 paragraphs).`,
      },
    ],
  });

  const overallSummary = result.text;

  await prisma.library.update({
    where: { id: libraryId },
    data: { overallSummary },
  });
}
