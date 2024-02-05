import { type InstructorsRepository } from '@/domain/course-management/application/repositories/instructors-repository'
import { type InstructorWithCoursesDTO } from '@/domain/course-management/enterprise/entities/dtos/instructor-with-courses'
import { type Instructor } from './../../src/domain/course-management/enterprise/entities/instructor'
import { type InMemoryCoursesRepository } from './in-memory-courses-repository'

export class InMemoryInstructorRepository implements InstructorsRepository {
  public items: Instructor[] = []

  constructor(private readonly inMemoryCoursesRepository: InMemoryCoursesRepository) {}

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

  async findInstructorWithCoursesById(id: string): Promise<InstructorWithCoursesDTO | null> {
    const instructor = this.items.find(instructorToCompare => instructorToCompare.id.toString() === id)

    if (!instructor) {
      return null
    }

    const courses = await this.inMemoryCoursesRepository.findManyByInstructorId(id)

    const instructorWithCourses: InstructorWithCoursesDTO = {
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        summary: instructor.summary,
        age: instructor.age,
        registeredAt: instructor.registeredAt,
        profileImageKey: instructor.profileImageKey,
        bannerImageKey: instructor.bannerImageKey
      },
      courses
    }

    return instructorWithCourses
  }

  async create(instructor: Instructor): Promise<Instructor> {
    this.items.push(instructor)
    return instructor
  }
}
