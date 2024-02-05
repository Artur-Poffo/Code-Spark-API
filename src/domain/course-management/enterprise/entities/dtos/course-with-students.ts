import { type Student } from '../student'
import { type CourseDTO } from './course'

export interface CourseWithStudentsDTO {
  course: CourseDTO
  students: Student[]
}
