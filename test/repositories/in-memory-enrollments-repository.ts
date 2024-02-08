import { type EnrollmentsRepository } from '@/domain/course-management/application/repositories/enrollments-repository'
import { type Enrollment } from '@/domain/course-management/enterprise/entities/enrollment'
import { type InMemoryClassesRepository } from './in-memory-classes-repository'
import { type InMemoryModulesRepository } from './in-memory-modules-repository'

export class InMemoryEnrollmentsRepository implements EnrollmentsRepository {
  public items: Enrollment[] = []

  constructor(
    private readonly inMemoryClassesRepository: InMemoryClassesRepository,
    private readonly inMemoryModulesRepository: InMemoryModulesRepository
  ) {}

  async findById(id: string): Promise<Enrollment | null> {
    const enrollment = this.items.find(enrollmentToCompare => enrollmentToCompare.id.toString() === id)

    if (!enrollment) {
      return null
    }

    return enrollment
  }

  async findByStudentIdAndCourseId(studentId: string, courseId: string): Promise<Enrollment | null> {
    const enrollment = this.items.find(enrollmentToCompare => {
      if (enrollmentToCompare.studentId.toString() === studentId && enrollmentToCompare.courseId.toString() === courseId) {
        return enrollmentToCompare
      }

      return undefined
    })

    if (!enrollment) {
      return null
    }

    return enrollment
  }

  async findManyByCourseId(courseId: string): Promise<Enrollment[]> {
    return this.items.filter(enrollmentToFilter => enrollmentToFilter.courseId.toString() === courseId)
  }

  async markClassAsCompleted(classId: string, enrollment: Enrollment): Promise<Enrollment | null> {
    const classToFind = await this.inMemoryClassesRepository.findById(classId)

    if (!classToFind) {
      return null
    }

    enrollment.completedClasses.push(classToFind.id)
    await this.save(enrollment)

    return enrollment
  }

  async markModuleAsCompleted(moduleId: string, enrollment: Enrollment): Promise<Enrollment | null> {
    const module = await this.inMemoryModulesRepository.findById(moduleId)

    if (!module) {
      return null
    }

    enrollment.completedClasses.push(module.id)
    await this.save(enrollment)

    return enrollment
  }

  async create(enrollment: Enrollment): Promise<Enrollment> {
    this.items.push(enrollment)
    return enrollment
  }

  async save(enrollment: Enrollment): Promise<void> {
    const enrollmentIndex = this.items.indexOf(enrollment)
    this.items[enrollmentIndex] = enrollment
  }
}
