"use client";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Props = {
  library: {
    sources: {
      id: string;
      fileName: string;
      fileSize: number;
      status: string;
      summary: string | null;
      libraryId: string;
      createdAt: Date;
      updatedAt: Date;
      fileType: string;
      mimeType: string;
      storageUrl: string;
      storageKey: string;
      processingError: string | null;
    }[];
  } & {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    overallSummary: string | null;
  };
};

const DocList = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { library } = props;

  return (
    <div>
      <div className="text-white flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">
          Documents ({library.sources.length})
        </h2>
        <button
          className="flex items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown className="btn-back" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100%" }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4"
          >
            {library.sources.map((source) => (
              <div key={source.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-white">
                      {source.fileName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {(source.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <span
                    className={`p-2 w-26 text-center text-xs rounded ${
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
                  <div className="mt-3 p-8 bg-purple-900/30 rounded">
                    <p className="text-justify font-serif tracking-tight text-sm text-white/90 whitespace-pre-wrap">
                      {source.summary}
                    </p>
                  </div>
                )}

                {/* {source.processingError && ( */}
                {/*   <div className="mt-3 p-3 bg-red-50 rounded"> */}
                {/*     <p className="text-sm text-red-700"> */}
                {/*       Error: {source.processingError} */}
                {/*     </p> */}
                {/*   </div> */}
                {/* )} */}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocList;
