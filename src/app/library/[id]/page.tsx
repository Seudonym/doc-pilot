import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

import { DocumentUploader } from "@/components/doc-uploader";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const user = (await auth.api.getSession({ headers: await headers() }))?.user;
  const library = await prisma.library.findFirst({
    where: { id, userId: user?.id },
    include: {
      sources: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!library) return <div>Library not found</div>;
  console.log(library);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{library.name}</h1>

      {/* Upload Section */}
      <div className="mb-8 p-4 border rounded-lg text-white bg-purple-900/30">
        <h2 className="text-xl font-semibold mb-3">Upload Documents</h2>
        <DocumentUploader libraryId={id} />
      </div>

      {/* Documents List */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Documents ({library.sources.length})
        </h2>

        <div className="space-y-4">
          {library.sources.map((source) => (
            <div key={source.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium">{source.fileName}</h3>
                  <p className="text-sm text-gray-500">
                    {(source.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>

                <span
                  className={`px-2 py-1 text-xs rounded ${
                    source.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : source.status === "PROCESSING"
                        ? "bg-yellow-100 text-yellow-700"
                        : source.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {source.status}
                </span>
              </div>

              {source.summary && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {source.summary}
                  </p>
                </div>
              )}

              {source.processingError && (
                <div className="mt-3 p-3 bg-red-50 rounded">
                  <p className="text-sm text-red-700">
                    Error: {source.processingError}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Overall Summary */}
      {library.overallSummary && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">📚 library Summary</h2>
          <p className="whitespace-pre-wrap text-gray-700">
            {library.overallSummary}
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
