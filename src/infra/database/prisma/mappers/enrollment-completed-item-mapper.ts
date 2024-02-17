import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EnrollmentCompletedItem } from '@/domain/course-management/enterprise/entities/enrollment-completed-item'
import { type Prisma, type EnrollmentCompletedItem as PrismaEnrollmentCompletedItem } from '@prisma/client'

export class EnrollmentCompletedItemMapper {
  static toDomain(raw: PrismaEnrollmentCompletedItem): EnrollmentCompletedItem {
    return EnrollmentCompletedItem.create(
      {
        enrollmentId: new UniqueEntityID(raw.enrollmentId),
        itemId: new UniqueEntityID(raw.itemId),
        type: raw.itemType
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(enrollmentCompletedItem: EnrollmentCompletedItem): Prisma.EnrollmentCompletedItemUncheckedCreateInput {
    return {
      id: enrollmentCompletedItem.id.toString(),
      enrollmentId: enrollmentCompletedItem.enrollmentId.toString(),
      itemId: enrollmentCompletedItem.itemId.toString(),
      itemType: enrollmentCompletedItem.type
    }
  }
}
