/*
  Warnings:

  - You are about to drop the column `fbPageId` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[facebookId]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `facebookId` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Page_fbPageId_key";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "fbPageId",
ADD COLUMN     "facebookId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Page_facebookId_key" ON "Page"("facebookId");
