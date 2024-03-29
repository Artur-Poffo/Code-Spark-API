import { type StudentsRepository } from '@/domain/course-management/application/repositories/students-repository'
import { type Student } from '@/domain/course-management/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findById(id: string): Promise<Student | null> {
    const student = this.items.find((studentToCompare) => studentToCompare.id.toString() === id)

    if (!student) {
      return null
    }

    return student
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((studentToCompare) => studentToCompare.email === email)

    if (!student) {
      return null
    }

    return student
  }

  async findByCpf(cpf: string): Promise<Student | null> {
    const student = this.items.find((studentToCompare) => studentToCompare.cpf === cpf)

    if (!student) {
      return null
    }

    return student
  }

  async create(student: Student): Promise<Student> {
    this.items.push(student)
    return student
  }

  async save(student: Student): Promise<void> {
    const studentIndex = this.items.indexOf(student)
    this.items[studentIndex] = student
  }
}
