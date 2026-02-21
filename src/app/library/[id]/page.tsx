import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

import { DocumentUploader } from "@/components/doc-uploader";
import { ArrowDown, ChevronDown } from "lucide-react";
import DocList from "@/components/doc-list";

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

  return (
    <div className="container max-w-prose md:max-w-3/4 mx-auto p-6">
      <h1 className="text-3xl text-white font-bold mb-4">{library.name}</h1>

      {/* Upload Section */}
      <div className="mb-8 p-4 border rounded-lg text-white bg-purple-900/30">
        <h2 className="text-xl font-semibold mb-3">Upload Documents</h2>
        <DocumentUploader libraryId={id} />
      </div>

      {/* Documents List */}
      <DocList library={library} />
      {/* Overall Summary */}
      {library.overallSummary && (
        <div className="mt-8 p-8 bg-purple-900/30 rounded">
          <h2 className="text-xl text-white font-semibold mb-3">
            📚 Library Summary
          </h2>
          <p className="text-justify font-serif tracking-tight text-sm text-white/90 whitespace-pre-wrap">
            {library.overallSummary}
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
