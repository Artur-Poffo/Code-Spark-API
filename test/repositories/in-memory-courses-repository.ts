import { type CoursesRepository } from '@/domain/course-management/application/repositories/courses-repository'
import { type Course } from '@/domain/course-management/enterprise/entities/course'

export class InMemoryCoursesRepository implements CoursesRepository {
  public items: Course[] = []

  async findManyByInstructorId(instructorId: string): Promise<Course[]> {
    return this.items.filter(courseToCompare => courseToCompare.instructorId.toString() === instructorId)
  }

  async create(course: Course): Promise<Course> {
    this.items.push(course)
    return course
  }
}
