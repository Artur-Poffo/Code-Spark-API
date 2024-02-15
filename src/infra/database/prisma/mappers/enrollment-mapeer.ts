import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Enrollment } from '@/domain/course-management/enterprise/entities/enrollment'
import { type Prisma, type Enrollment as PrismaEnrollment } from '@prisma/client'

export class EnrollmentMapper {
  static toDomain(raw: PrismaEnrollment): Enrollment {
    return Enrollment.create(
      {
        courseId: new UniqueEntityID(raw.courseId),
        studentId: new UniqueEntityID(raw.userId)
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(enrollment: Enrollment): Prisma.EnrollmentUncheckedCreateInput {
    return {
      id: enrollment.id.toString(),
      courseId: enrollment.courseId.toString(),
      userId: enrollment.studentId.toString(),
      completedAt: enrollment.completedAt,
      ocurredAt: enrollment.ocurredAt
    }
  }
}
