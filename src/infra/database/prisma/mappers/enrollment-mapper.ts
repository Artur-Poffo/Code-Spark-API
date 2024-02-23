import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Enrollment } from '@/domain/course-management/enterprise/entities/enrollment'
import { type Prisma, type Enrollment as PrismaEnrollment } from '@prisma/client'
import { type EnrollmentCompletedItemsRepository } from './../../../../domain/course-management/application/repositories/enrollment-completed-items-repository'

export class EnrollmentMapper {
  constructor(
    private readonly enrollmentCompletedItemsRepository: EnrollmentCompletedItemsRepository
  ) {}

  async toDomain(raw: PrismaEnrollment): Promise<Enrollment | null> {
    return Enrollment.create(
      {
        courseId: new UniqueEntityID(raw.courseId),
        studentId: new UniqueEntityID(raw.studentId),
        completedAt: raw.completedAt,
        ocurredAt: raw.ocurredAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(enrollment: Enrollment): Promise<Prisma.EnrollmentUncheckedCreateInput> {
    const completedItemIds = await this.enrollmentCompletedItemsRepository.findAllByEnrollmentId(enrollment.id.toString())

    return {
      id: enrollment.id.toString(),
      courseId: enrollment.courseId.toString(),
      studentId: enrollment.studentId.toString(),
      completedAt: enrollment.completedAt,
      ocurredAt: enrollment.ocurredAt,
      enrollmentCompletedItems: {
        connect: completedItemIds.map(completedItem => ({ id: completedItem.id.toString() })) as unknown as Prisma.EnrollmentCompletedItemWhereUniqueInput[]
      }
    }
  }
}
