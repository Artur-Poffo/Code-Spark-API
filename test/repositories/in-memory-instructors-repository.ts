import { type InstructorsRepository } from '@/domain/course-management/application/repositories/instructors-repository'
import { type Instructor } from '@/domain/course-management/enterprise/entities/instructor'

export class InMemoryInstructorRepository implements InstructorsRepository {
  public items: Instructor[] = []

  async findByEmail(email: string): Promise<Instructor | null> {
    const instructor = this.items.find(instructorToCompare => instructorToCompare.email === email)

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
