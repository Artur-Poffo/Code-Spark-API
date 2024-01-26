import { type Instructor } from '../../enterprise/entities/instructor'
import { type InstructorWithCoursesDTO } from './../../enterprise/entities/dtos/instructor-with-courses'

export interface InstructorsRepository {
  findById: (id: string) => Promise<Instructor | null>
  findByEmail: (email: string) => Promise<Instructor | null>
  findByCpf: (cpf: string) => Promise<Instructor | null>
  findInstructorWithCoursesById: (id: string) => Promise<InstructorWithCoursesDTO | null>
  create: (instructor: Instructor) => Promise<Instructor>
}
