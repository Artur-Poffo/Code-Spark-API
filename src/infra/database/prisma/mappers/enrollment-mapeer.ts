import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Enrollment } from '@/domain/course-management/enterprise/entities/enrollment'
import { type Prisma, type Enrollment as PrismaEnrollment } from '@prisma/client'
import { type EnrollmentsRepository } from './../../../../domain/course-management/application/repositories/enrollments-repository'

export class EnrollmentMapper {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository
  ) {}

  async toDomain(raw: PrismaEnrollment): Promise<Enrollment | null> {
    // FIXME: Fix infinity loop, repository call mapper and mapper call repository
    const enrollment = await this.enrollmentsRepository.findById(raw.id)

    if (!enrollment) {
      return null
    }

    return Enrollment.create(
      {
        courseId: new UniqueEntityID(raw.courseId),
        studentId: new UniqueEntityID(raw.userId),
        completedAt: raw.completedAt,
        ocurredAt: raw.ocurredAt,
        completedClasses: enrollment.completedClasses,
        completedModules: enrollment.completedModules
      },
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(enrollment: Enrollment): Promise<Prisma.EnrollmentUncheckedCreateInput | null> {
    const completedItemIds = [...enrollment.completedClasses, ...enrollment.completedModules]

    return {
      id: enrollment.id.toString(),
      courseId: enrollment.courseId.toString(),
      userId: enrollment.studentId.toString(),
      completedAt: enrollment.completedAt,
      ocurredAt: enrollment.ocurredAt,
      enrollmentCompletedItems: {
        connect: completedItemIds.map(completedItemId => ({ id: completedItemId.toString() })) as unknown as Prisma.EnrollmentCompletedItemWhereUniqueInput[]
      }
    }
  }
}
