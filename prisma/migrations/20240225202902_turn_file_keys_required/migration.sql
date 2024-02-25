/*
  Warnings:

  - Made the column `file_key` on table `images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `file_key` on table `videos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_file_key_fkey";

-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_file_key_fkey";

-- AlterTable
ALTER TABLE "images" ALTER COLUMN "file_key" SET NOT NULL;

-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "file_key" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_file_key_fkey" FOREIGN KEY ("file_key") REFERENCES "files"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_file_key_fkey" FOREIGN KEY ("file_key") REFERENCES "files"("key") ON DELETE RESTRICT ON UPDATE CASCADE;
