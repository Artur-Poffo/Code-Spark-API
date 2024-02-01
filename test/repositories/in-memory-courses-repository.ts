import { type CoursesRepository } from '@/domain/course-management/application/repositories/courses-repository'
import { type CompleteCourseDTO } from '@/domain/course-management/enterprise/entities/dtos/complete-course'
import { type Course } from './../../src/domain/course-management/enterprise/entities/course'
import { type ModuleWithClassesDTO } from './../../src/domain/course-management/enterprise/entities/dtos/module-with-classes'
import { type InMemoryInstructorRepository } from './in-memory-instructors-repository'
import { type InMemoryModulesRepository } from './in-memory-modules-repository'

export class InMemoryCoursesRepository implements CoursesRepository {
  public items: Course[] = []

  constructor(
    private readonly inMemoryModulesRepository: InMemoryModulesRepository,
    private readonly inMemoryInstructorRepository: InMemoryInstructorRepository
  ) {}

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

  async findCompleteCourseEntityById(id: string): Promise<CompleteCourseDTO | null> {
    const course = this.items.find(courseToCompare => courseToCompare.id.toString() === id)

    if (!course) {
      return null
    }

    const instructor = await this.inMemoryInstructorRepository.findById(course.instructorId.toString())

    if (!instructor) {
      return null
    }

    const courseModules = await this.inMemoryModulesRepository.findManyByCourseId(course.id.toString())
    const courseModulesAndClasses = await Promise.all(courseModules.map(async courseModule => await this.inMemoryModulesRepository.findModuleWithClassesById(courseModule.id.toString())))

    const nonNullModulesAndClasses: ModuleWithClassesDTO[] = courseModulesAndClasses.filter(courseModuleToCompare => courseModuleToCompare !== null) as ModuleWithClassesDTO[]

    const completeCourse: CompleteCourseDTO = {
      courseId: course.id,
      instructorId: instructor.id,
      instructor: {
        name: instructor.name,
        email: instructor.email,
        summary: instructor.summary,
        age: instructor.age,
        registeredAt: instructor.registeredAt,
        profileImageKey: instructor.profileImageKey,
        bannerImageKey: instructor.bannerImageKey
      },
      modules: nonNullModulesAndClasses.length > 0 ? nonNullModulesAndClasses : []
    }

    return completeCourse
  }

  async create(course: Course): Promise<Course> {
    this.items.push(course)
    return course
  }
}
