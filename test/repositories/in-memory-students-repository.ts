import { type StudentsRepository } from '@/domain/course-management/application/repositories/students-repository'
import { type Student } from '@/domain/course-management/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((studentToCompare) => studentToCompare.email === email)

    if (!student) {
      return null
    }

    return student
  }

  async create(student: Student): Promise<Student> {
    this.items.push(student)
    return student
  }
}
