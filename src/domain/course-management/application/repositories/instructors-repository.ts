import { type Instructor } from '../../enterprise/entities/instructor'
import { type InstructorWithCourses } from '../../enterprise/entities/value-objects/instructor-with-courses'

export interface InstructorsRepository {
  findById: (id: string) => Promise<Instructor | null>
  findByEmail: (email: string) => Promise<Instructor | null>
  findByCpf: (cpf: string) => Promise<Instructor | null>
  findInstructorWithCoursesById: (id: string) => Promise<InstructorWithCourses | null>
  create: (instructor: Instructor) => Promise<Instructor>
}
