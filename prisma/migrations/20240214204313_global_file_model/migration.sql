/*
  Warnings:

  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `videos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileTypes" AS ENUM ('MP4', 'AVI', 'JPEG', 'PNG');

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_file_id_fkey";

-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_file_id_fkey";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "type" "FileTypes" NOT NULL;

-- DropTable
DROP TABLE "images";

-- DropTable
DROP TABLE "videos";

-- DropEnum
DROP TYPE "ImageTypes";

-- DropEnum
DROP TYPE "VideoTypes";
