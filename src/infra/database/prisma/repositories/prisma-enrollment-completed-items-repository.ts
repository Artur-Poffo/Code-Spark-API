import { type EnrollmentCompletedItemsRepository } from '@/domain/course-management/application/repositories/enrollment-completed-items-repository'
import { type EnrollmentCompletedItem } from '@/domain/course-management/enterprise/entities/enrollment-completed-item'
import { prisma } from '..'
import { EnrollmentCompletedItemMapper } from './../mappers/enrollment-completed-item-mapper'

export class PrismaEnrollmentCompleteItemsRepository implements EnrollmentCompletedItemsRepository {
  async findById(id: string): Promise<EnrollmentCompletedItem | null> {
    const completedItem = await prisma.enrollmentCompletedItem.findUnique({
      where: {
        id
      }
    })

    if (!completedItem) {
      return null
    }

    const domainCompletedItem = EnrollmentCompletedItemMapper.toDomain(completedItem)

    return domainCompletedItem
  }

  async findByEnrollmentIdAndItemId(enrollmentId: string, itemId: string): Promise<EnrollmentCompletedItem | null> {
    const completedItem = await prisma.enrollmentCompletedItem.findFirst({
      where: {
        enrollmentId,
        itemId
      }
    })

    if (!completedItem) {
      return null
    }

    const domainCompletedItem = EnrollmentCompletedItemMapper.toDomain(completedItem)

    return domainCompletedItem
  }

  async findManyCompletedClassesByEnrollmentId(enrollmentId: string): Promise<EnrollmentCompletedItem[]> {
    const completedItems = await prisma.enrollmentCompletedItem.findMany({
      where: {
        enrollmentId,
        itemType: 'CLASS'
      }
    })

    const domainCompletedItems = completedItems.map(completedItem => EnrollmentCompletedItemMapper.toDomain(completedItem))

    return domainCompletedItems
  }

  async findManyCompletedModulesByEnrollmentId(enrollmentId: string): Promise<EnrollmentCompletedItem[]> {
    const completedItems = await prisma.enrollmentCompletedItem.findMany({
      where: {
        enrollmentId,
        itemType: 'MODULE'
      }
    })

    const domainCompletedItems = completedItems.map(completedItem => EnrollmentCompletedItemMapper.toDomain(completedItem))

    return domainCompletedItems
  }

  async findAllByEnrollmentId(enrollmentId: string): Promise<EnrollmentCompletedItem[]> {
    const completedItems = await prisma.enrollmentCompletedItem.findMany({
      where: {
        enrollmentId
      }
    })

    const domainCompletedItems = completedItems.map(completedItem => EnrollmentCompletedItemMapper.toDomain(completedItem))

    return domainCompletedItems
  }

  async create(completedItem: EnrollmentCompletedItem): Promise<EnrollmentCompletedItem> {
    const infraCompletedItem = EnrollmentCompletedItemMapper.toPrisma(completedItem)

    await prisma.enrollmentCompletedItem.create({
      data: infraCompletedItem
    })

    return completedItem
  }

  async delete(completedItem: EnrollmentCompletedItem): Promise<void> {
    await prisma.enrollmentCompletedItem.delete({
      where: {
        id: completedItem.id.toString()
      }
    })
  }
}
