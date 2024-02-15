/*
  Warnings:

  - Changed the type of `item_type` on the `EnrollmentCompletedItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EnrollmentCompletedItemTypes" AS ENUM ('CLASS', 'MODULE');

-- CreateEnum
CREATE TYPE "VideoTypes" AS ENUM ('MP4', 'AVI');

-- CreateEnum
CREATE TYPE "ImageTypes" AS ENUM ('JPEG', 'PNG');

-- AlterTable
ALTER TABLE "EnrollmentCompletedItem" DROP COLUMN "item_type",
ADD COLUMN     "item_type" "EnrollmentCompletedItemTypes" NOT NULL;

-- DropEnum
DROP TYPE "EnrollmentCompletedItemType";

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "size" DECIMAL(65,30) NOT NULL,
    "stored_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "type" "VideoTypes" NOT NULL,
    "duration" DECIMAL(65,30) NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "type" "ImageTypes" NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_key_key" ON "files"("key");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
