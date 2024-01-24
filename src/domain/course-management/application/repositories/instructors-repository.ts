import { type Instructor } from '../../enterprise/entities/instructor'

export interface InstructorsRepository {
  findByEmail: (email: string) => Promise<Instructor | null>
  findByCpf: (cpf: string) => Promise<Instructor | null>
  create: (instructor: Instructor) => Promise<Instructor>
}
