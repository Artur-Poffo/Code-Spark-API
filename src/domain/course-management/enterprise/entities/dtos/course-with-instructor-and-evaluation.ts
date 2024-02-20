import { type CourseDTO } from './course'
import { type InstructorDTO } from './instructor'

export interface CourseWithInstructorAndEvaluationDTO {
  course: CourseDTO
  instructor: InstructorDTO
  evaluationsAverage: number
}
