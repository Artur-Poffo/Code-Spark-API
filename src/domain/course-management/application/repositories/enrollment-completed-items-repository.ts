import { type EnrollmentCompletedItem } from '../../enterprise/entities/enrollment-completed-item'

export interface EnrollmentCompletedItemsRepository {
  findById: (id: string) => Promise<EnrollmentCompletedItem | null>
  findManyCompletedClassesByEnrollmentId: (enrollmentId: string) => Promise<EnrollmentCompletedItem[]>
  findManyCompletedModulesByEnrollmentId: (enrollmentId: string) => Promise<EnrollmentCompletedItem[]>
  findAllByEnrollmentId: (enrollmentId: string) => Promise<EnrollmentCompletedItem[]>
  create: (completedItem: EnrollmentCompletedItem) => Promise<EnrollmentCompletedItem>
}
