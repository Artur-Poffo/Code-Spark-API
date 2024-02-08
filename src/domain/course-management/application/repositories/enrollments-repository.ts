import { type Enrollment } from '../../enterprise/entities/enrollment'

export interface EnrollmentsRepository {
  findById: (id: string) => Promise<Enrollment | null>
  findByStudentIdAndCourseId: (studentId: string, courseId: string) => Promise<Enrollment | null>
  findManyByCourseId: (courseId: string) => Promise<Enrollment[]>
  create: (enrollment: Enrollment) => Promise<Enrollment>
  save: (classToSave: Enrollment) => Promise<void>
}