import { type Prisma } from '@prisma/client'

export class EnrollmentCompletedItemPresenter {
  static toHTTP(enrollmentCompletedItem: Prisma.EnrollmentCompletedItemUncheckedCreateInput) {
    return {
      id: enrollmentCompletedItem.id,
      enrollmentId: enrollmentCompletedItem.enrollmentId,
      itemId: enrollmentCompletedItem.itemId,
      itemType: enrollmentCompletedItem.itemType
    }
  }
}
