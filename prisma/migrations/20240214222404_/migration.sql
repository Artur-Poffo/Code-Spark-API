/*
  Warnings:

  - A unique constraint covering the columns `[file_id]` on the table `videos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_file_id_fkey";

-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "file_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "videos_file_id_key" ON "videos"("file_id");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
