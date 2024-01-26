import { type Course } from '../../enterprise/entities/course'
import { type CompleteCourseDTO } from '../../enterprise/entities/dtos/complete-course'

export interface CoursesRepository {
  findById: (id: string) => Promise<Course | null>
  findManyByInstructorId: (instructorId: string) => Promise<Course[]>
  findCompleteCourseEntityById: (id: string) => Promise<CompleteCourseDTO | null>
  create: (course: Course) => Promise<Course>
}
