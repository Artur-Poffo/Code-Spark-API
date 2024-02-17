/*
  Warnings:

  - You are about to drop the column `user_id` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `students_certificates` table. All the data in the column will be lost.
  - Added the required column `student_id` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `evaluations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `students_certificates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "evaluations" DROP CONSTRAINT "evaluations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "students_certificates" DROP CONSTRAINT "students_certificates_user_id_fkey";

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "user_id",
ADD COLUMN     "student_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "evaluations" DROP COLUMN "user_id",
ADD COLUMN     "student_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students_certificates" DROP COLUMN "user_id",
ADD COLUMN     "student_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students_certificates" ADD CONSTRAINT "students_certificates_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
