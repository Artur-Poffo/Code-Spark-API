import { type InstructorsRepository } from '@/domain/course-management/application/repositories/instructors-repository'
import { type Instructor } from './../../src/domain/course-management/enterprise/entities/instructor'

export class InMemoryInstructorRepository implements InstructorsRepository {
  public items: Instructor[] = []

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

  async create(instructor: Instructor): Promise<Instructor> {
    this.items.push(instructor)
    return instructor
  }
}
