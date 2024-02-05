import { type Course } from '../course'
import { type InstructorDTO } from './instructor'

export interface InstructorWithCoursesDTO {
  instructor: InstructorDTO
  courses: Course[]
}
