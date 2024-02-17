/*
  Warnings:

  - The primary key for the `EnrollmentCompletedItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "EnrollmentCompletedItem" DROP CONSTRAINT "EnrollmentCompletedItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "EnrollmentCompletedItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "EnrollmentCompletedItem_id_seq";
