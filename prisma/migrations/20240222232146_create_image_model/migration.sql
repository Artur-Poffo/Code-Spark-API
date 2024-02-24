-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "file_key" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_file_key_key" ON "images"("file_key");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_file_key_fkey" FOREIGN KEY ("file_key") REFERENCES "files"("key") ON DELETE SET NULL ON UPDATE CASCADE;
