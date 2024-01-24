import { type Student } from '../../enterprise/entities/student'

export interface StudentsRepository {
  findByEmail: (email: string) => Promise<Student | null>
  findByCpf: (cpf: string) => Promise<Student | null>
  create: (student: Student) => Promise<Student>
}
