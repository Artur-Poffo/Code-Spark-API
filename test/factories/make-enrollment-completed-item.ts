import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EnrollmentCompletedItem, type EnrollmentCompletedItemProps } from '@/domain/course-management/enterprise/entities/enrollment-completed-item'

export function makeEnrollmentCompletedItem(
  override: Partial<EnrollmentCompletedItemProps> = {},
  id?: UniqueEntityID
) {
  const enrollmentCompletedItem = EnrollmentCompletedItem.create(
    {
      enrollmentId: override.enrollmentId ?? new UniqueEntityID(),
      itemId: override.itemId ?? new UniqueEntityID(),
      type: override.type ?? 'MODULE',
      ...override
    },
    id
  )

  return enrollmentCompletedItem
}
