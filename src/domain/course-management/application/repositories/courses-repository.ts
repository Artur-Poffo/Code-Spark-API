import { type Course } from '../../enterprise/entities/course'
import { type CompleteCourseEntity } from '../../enterprise/entities/value-objects/complete-course-entity'

export interface CoursesRepository {
  findById: (id: string) => Promise<Course | null>
  findManyByInstructorId: (instructorId: string) => Promise<Course[]>
  findManyCoursesCompleteEntity: () => Promise<CompleteCourseEntity[]>
  create: (course: Course) => Promise<Course>
}
