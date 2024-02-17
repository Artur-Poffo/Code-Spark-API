/*
  Warnings:

  - You are about to drop the column `file_id` on the `videos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_key]` on the table `videos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_key` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_file_id_fkey";

-- DropIndex
DROP INDEX "videos_file_id_key";

-- AlterTable
ALTER TABLE "videos" DROP COLUMN "file_id",
ADD COLUMN     "file_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "videos_file_key_key" ON "videos"("file_key");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_file_key_fkey" FOREIGN KEY ("file_key") REFERENCES "files"("key") ON DELETE RESTRICT ON UPDATE CASCADE;
