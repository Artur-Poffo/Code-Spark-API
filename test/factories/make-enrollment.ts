import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Enrollment, type EnrollmentProps } from '@/domain/course-management/enterprise/entities/enrollment'

export function makeEnrollment(
  override: Partial<EnrollmentProps> = {},
  id?: UniqueEntityID
) {
  const enrollment = Enrollment.create(
    {
      studentId: override.courseId ?? new UniqueEntityID(),
      courseId: override.courseId ?? new UniqueEntityID(),
      completedModules: [],
      completedClasses: [],
      ocurredAt: override.ocurredAt ?? new Date(),
      completedAt: override.completedAt ?? null,
      ...override
    },
    id
  )

  return enrollment
}
