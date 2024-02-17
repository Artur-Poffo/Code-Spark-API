import { type Enrollment } from '../../enterprise/entities/enrollment'
import { type Student } from '../../enterprise/entities/student'

export interface EnrollmentsRepository {
  findById: (id: string) => Promise<Enrollment | null>
  findByStudentIdAndCourseId: (studentId: string, courseId: string) => Promise<Enrollment | null>
  findManyByCourseId: (courseId: string) => Promise<Enrollment[]>
  findManyByStudentId: (studentId: string) => Promise<Enrollment[]>
  findManyStudentsByCourseId: (courseId: string) => Promise<Student[]>
  markItemAsCompleted: (completedItemId: string, enrollment: Enrollment) => Promise<Enrollment | null>
  markAsCompleted: (enrollment: Enrollment) => Promise<Enrollment | null>
  countEnrollmentsByYear: (year: number) => Promise<number>
  create: (enrollment: Enrollment) => Promise<Enrollment | null>
  save: (enrollment: Enrollment) => Promise<void>
  delete: (enrollment: Enrollment) => Promise<void>
}
