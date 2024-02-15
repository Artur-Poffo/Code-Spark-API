/*
  Warnings:

  - You are about to drop the column `video_key` on the `classes` table. All the data in the column will be lost.
  - Added the required column `video_id` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "video_key",
ADD COLUMN     "video_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "duration" DECIMAL(65,30) NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
