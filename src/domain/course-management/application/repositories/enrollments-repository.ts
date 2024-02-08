import { type Enrollment } from '../../enterprise/entities/enrollment'

export interface EnrollmentsRepository {
  findById: (id: string) => Promise<Enrollment | null>
  findByStudentIdAndCourseId: (studentId: string, courseId: string) => Promise<Enrollment | null>
  findManyByCourseId: (courseId: string) => Promise<Enrollment[]>
  markClassAsCompleted: (classId: string, enrollment: Enrollment) => Promise<Enrollment | null>
  markModuleAsCompleted: (moduleId: string, enrollment: Enrollment) => Promise<Enrollment | null>
  markAsCompleted: (enrollment: Enrollment) => Promise<Enrollment>
  create: (enrollment: Enrollment) => Promise<Enrollment>
  save: (classToSave: Enrollment) => Promise<void>
}
