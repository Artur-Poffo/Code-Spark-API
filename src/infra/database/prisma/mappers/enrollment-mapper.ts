import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Enrollment } from '@/domain/course-management/enterprise/entities/enrollment'
import { type Prisma, type Enrollment as PrismaEnrollment } from '@prisma/client'
import { type EnrollmentCompletedItemsRepository } from './../../../../domain/course-management/application/repositories/enrollment-completed-items-repository'

export class EnrollmentMapper {
  constructor(
    private readonly enrollmentCompletedItemsRepository: EnrollmentCompletedItemsRepository
  ) {}

  async toDomain(raw: PrismaEnrollment): Promise<Enrollment | null> {
    const completedItems = await this.enrollmentCompletedItemsRepository.findAllByEnrollmentId(raw.id)
    const completedItemIds = completedItems.map(completedItem => completedItem.id)

    return Enrollment.create(
      {
        courseId: new UniqueEntityID(raw.courseId),
        studentId: new UniqueEntityID(raw.studentId),
        completedAt: raw.completedAt,
        ocurredAt: raw.ocurredAt,
        completedItems: completedItemIds
      },
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(enrollment: Enrollment): Promise<Prisma.EnrollmentUncheckedCreateInput> {
    const completedItemIds = [...enrollment.completedItems]

    return {
      id: enrollment.id.toString(),
      courseId: enrollment.courseId.toString(),
      studentId: enrollment.studentId.toString(),
      completedAt: enrollment.completedAt,
      ocurredAt: enrollment.ocurredAt,
      enrollmentCompletedItems: {
        connect: completedItemIds.map(completedItemId => ({ id: completedItemId.toString() })) as unknown as Prisma.EnrollmentCompletedItemWhereUniqueInput[]
      }
    }
  }
}
