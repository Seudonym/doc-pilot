import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

export const uploadFileRouter = {
  documentUploader: f({
    "application/pdf": {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .input(z.object({ libraryId: z.string() }))
    .middleware(async ({ req, input }) => {
      const user = (await auth.api.getSession({ headers: await headers() }))
        ?.user;
      if (!user) throw new UploadThingError("Unauthorized");

      const { libraryId } = input;
      const library = await prisma.library.findFirst({
        where: { id: libraryId, userId: user.id },
      });
      if (!library) throw new UploadThingError("No such library");

      return { userId: user.id, libraryId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      const source = await prisma.source.create({
        data: {
          libraryId: metadata.libraryId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          mimeType: file.type,
          storageUrl: file.ufsUrl,
          storageKey: file.key,
          status: "PROCESSING",
        },
      });

      await fetch(
        `${process.env.APP_URL ?? "http://localhost:3000"}/api/process-document`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceId: source.id,
            libraryId: metadata.libraryId,
            fileUrl: file.ufsUrl,
          }),
        },
      ).catch((e) => {
        console.log(e);
        prisma.source
          .update({
            where: { id: source.id },
            data: { status: "FAILED" },
          })
          .then(() => {});
      });

      return { sourceId: source.id };
    }),
} satisfies FileRouter;

export type UploadFileRouter = typeof uploadFileRouter;
