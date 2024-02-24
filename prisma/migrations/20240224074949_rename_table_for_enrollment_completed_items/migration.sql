/*
  Warnings:

  - You are about to drop the `EnrollmentCompletedItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EnrollmentCompletedItem" DROP CONSTRAINT "EnrollmentCompletedItem_enrollment_id_fkey";

-- DropTable
DROP TABLE "EnrollmentCompletedItem";

-- CreateTable
CREATE TABLE "enrollment_completed_items" (
    "id" TEXT NOT NULL,
    "item_type" "EnrollmentCompletedItemTypes" NOT NULL,
    "item_id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,

    CONSTRAINT "enrollment_completed_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "enrollment_completed_items" ADD CONSTRAINT "enrollment_completed_items_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
