/*
  Warnings:

  - Made the column `file_id` on table `videos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_file_id_fkey";

-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "file_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
