import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type CoursesRepository } from '@/domain/course-management/application/repositories/courses-repository'
import { type InstructorsRepository } from '@/domain/course-management/application/repositories/instructors-repository'
import { InstructorWithCourses } from '@/domain/course-management/enterprise/entities/value-objects/instructor-with-courses'
import { type Instructor } from './../../src/domain/course-management/enterprise/entities/instructor'

export class InMemoryInstructorRepository implements InstructorsRepository {
  public items: Instructor[] = []

  constructor(private readonly coursesRepository: CoursesRepository) {}

  async findById(id: string): Promise<Instructor | null> {
    const instructor = this.items.find(instructorToCompare => instructorToCompare.id.toString() === id)

    if (!instructor) {
      return null
    }

    return instructor
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    const instructor = this.items.find(instructorToCompare => instructorToCompare.email === email)

    if (!instructor) {
      return null
    }

    return instructor
  }

  async findByCpf(cpf: string): Promise<Instructor | null> {
    const instructor = this.items.find(instructorToCompare => instructorToCompare.cpf === cpf)

    if (!instructor) {
      return null
    }

    return instructor
  }

  async findInstructorWithCoursesById(id: string): Promise<InstructorWithCourses | null> {
    const instructor = this.items.find(instructorToCompare => instructorToCompare.id.toString() === id)

    if (!instructor) {
      return null
    }

    const courses = await this.coursesRepository.findManyByInstructorId(id)

    const instructorWithCourses = InstructorWithCourses.create({
      name: instructor.name,
      email: instructor.email,
      age: instructor.age,
      summary: instructor.summary,
      registeredAt: instructor.registeredAt,
      bannerImageKey: instructor.bannerImageKey,
      profileImageKey: instructor.profileImageKey,
      instructorId: new UniqueEntityID(id),
      courses
    })

    return instructorWithCourses
  }

  async create(instructor: Instructor): Promise<Instructor> {
    this.items.push(instructor)
    return instructor
  }
}
