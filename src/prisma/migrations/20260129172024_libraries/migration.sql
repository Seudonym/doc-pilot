/*
  Warnings:

  - You are about to drop the column `extractedText` on the `source` table. All the data in the column will be lost.
  - Added the required column `mimeType` to the `source` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageKey` to the `source` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageUrl` to the `source` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "source" DROP COLUMN "extractedText",
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "processingError" TEXT,
ADD COLUMN     "status" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "storageKey" TEXT NOT NULL,
ADD COLUMN     "storageUrl" TEXT NOT NULL;
