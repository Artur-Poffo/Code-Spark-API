import { type Course } from '../course'
import { type StudentDTO } from './student'

export interface StudentWithCoursesDTO {
  student: StudentDTO
  courses: Course[]
}
