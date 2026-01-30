"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

export function DocumentUploader({ libraryId }: { libraryId: string }) {
  const router = useRouter();

  return (
    <UploadButton
      endpoint="documentUploader"
      input={{ libraryId }}
      onClientUploadComplete={(res) => {
        router.refresh();
      }}
    />
  );
}
