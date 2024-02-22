-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_file_key_fkey";

-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "file_key" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_file_key_fkey" FOREIGN KEY ("file_key") REFERENCES "files"("key") ON DELETE SET NULL ON UPDATE CASCADE;
