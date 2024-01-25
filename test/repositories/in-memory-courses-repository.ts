import { type CoursesRepository } from '@/domain/course-management/application/repositories/courses-repository'
import { CompleteCourseEntity } from '@/domain/course-management/enterprise/entities/value-objects/complete-course-entity'
import { type Course } from './../../src/domain/course-management/enterprise/entities/course'
import { type InMemoryInstructorRepository } from './in-memory-instructors-repository'
import { type InMemoryModulesRepository } from './in-memory-modules-repository'

export class InMemoryCoursesRepository implements CoursesRepository {
  public items: Course[] = []

  constructor(private readonly inMemoryModulesRepository: InMemoryModulesRepository, private readonly inMemoryInstructorRepository: InMemoryInstructorRepository) {}

  async findById(id: string): Promise<Course | null> {
    const course = this.items.find(courseToCompare => courseToCompare.id.toString() === id)

    if (!course) {
      return null
    }

    return course
  }

  async findManyByInstructorId(instructorId: string): Promise<Course[]> {
    return this.items.filter(courseToCompare => courseToCompare.instructorId.toString() === instructorId)
  }

  async findCompleteCourseEntityById(id: string): Promise<CompleteCourseEntity | null> {
    const course = this.items.find(courseToCompare => courseToCompare.id.toString() === id)

    if (!course) {
      return null
    }

    const instructor = await this.inMemoryInstructorRepository.findById(course.instructorId.toString())

    if (!instructor) {
      return null
    }

    const courseModules = await this.inMemoryModulesRepository.findManyByCourseId(course.id.toString())

    const completeCourseEntity = CompleteCourseEntity.create({
      name: course.name,
      description: course.description,
      createdAt: course.createdAt,
      bannerImageKey: course.bannerImageKey,
      coverImageKey: course.coverImageKey,
      instructorId: course.instructorId,
      instructor,
      courseId: course.id,
      classes: [], // TODO: update with real course classes
      modules: courseModules
    })

    return completeCourseEntity
  }

  async create(course: Course): Promise<Course> {
    this.items.push(course)
    return course
  }
}
