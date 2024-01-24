import { type Course } from '../../enterprise/entities/course'

export interface CoursesRepository {
  findManyByInstructorId: (instructorId: string) => Promise<Course[]>
  create: (course: Course) => Promise<Course>
}
