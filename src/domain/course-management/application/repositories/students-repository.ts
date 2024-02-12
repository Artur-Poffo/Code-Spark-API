import { type Student } from '../../enterprise/entities/student'

export interface StudentsRepository {
  findById: (id: string) => Promise<Student | null>
  findByEmail: (email: string) => Promise<Student | null>
  findByCpf: (cpf: string) => Promise<Student | null>
  create: (student: Student) => Promise<Student>
  save: (student: Student) => Promise<void>
}
