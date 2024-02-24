import { type EnrollmentCompletedItemsRepository } from '@/domain/course-management/application/repositories/enrollment-completed-items-repository'
import { type EnrollmentCompletedItem } from '@/domain/course-management/enterprise/entities/enrollment-completed-item'

export class InMemoryEnrollmentCompletedItemsRepository implements EnrollmentCompletedItemsRepository {
  public items: EnrollmentCompletedItem[] = []

  async findById(id: string): Promise<EnrollmentCompletedItem | null> {
    const completedItem = this.items.find(completedItemToFind => completedItemToFind.id.toString() === id)

    if (!completedItem) {
      return null
    }

    return completedItem
  }

  async findByEnrollmentIdAndItemId(enrollmentId: string, itemId: string): Promise<EnrollmentCompletedItem | null> {
    // eslint-disable-next-line array-callback-return
    const completedItem = this.items.find(completeCourseItemToFind => {
      if (
        completeCourseItemToFind.enrollmentId.toString() === enrollmentId &&
        completeCourseItemToFind.itemId.toString() === itemId
      ) {
        return completeCourseItemToFind
      }
    })

    if (!completedItem) {
      return null
    }

    return completedItem
  }

  async findManyCompletedClassesByEnrollmentId(enrollmentId: string): Promise<EnrollmentCompletedItem[]> {
    const completedClassesOnEnrollment: EnrollmentCompletedItem[] = []

    this.items.forEach(completedItem => {
      if (completedItem.type === 'CLASS' && completedItem.enrollmentId.toString() === enrollmentId) {
        completedClassesOnEnrollment.push(completedItem)
      }
    })

    return completedClassesOnEnrollment
  }

  async findManyCompletedModulesByEnrollmentId(enrollmentId: string): Promise<EnrollmentCompletedItem[]> {
    const completedModulesOnEnrollment: EnrollmentCompletedItem[] = []

    this.items.forEach(completedItem => {
      if (completedItem.type === 'MODULE' && completedItem.enrollmentId.toString() === enrollmentId) {
        completedModulesOnEnrollment.push(completedItem)
      }
    })

    return completedModulesOnEnrollment
  }

  async findAllByEnrollmentId(enrollmentId: string): Promise<EnrollmentCompletedItem[]> {
    return this.items.filter(completedItemToFilter => completedItemToFilter.enrollmentId.toString() === enrollmentId)
  }

  async create(enrollmentCompletedItem: EnrollmentCompletedItem): Promise<EnrollmentCompletedItem> {
    this.items.push(enrollmentCompletedItem)
    return enrollmentCompletedItem
  }

  async delete(completedItem: EnrollmentCompletedItem): Promise<void> {
    const completedItemIndex = this.items.indexOf(completedItem)
    this.items.splice(completedItemIndex, 1)
  }
}
