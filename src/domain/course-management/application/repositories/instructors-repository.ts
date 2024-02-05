import { type Instructor } from '../../enterprise/entities/instructor'

export interface InstructorsRepository {
  findById: (id: string) => Promise<Instructor | null>
  findByEmail: (email: string) => Promise<Instructor | null>
  findByCpf: (cpf: string) => Promise<Instructor | null>
  create: (instructor: Instructor) => Promise<Instructor>
}
