import { type CourseDTO } from './course'
import { type InstructorDTO } from './instructor'

export interface CourseWithInstructorAndEvaluation {
  course: CourseDTO
  instructor: InstructorDTO
  evaluationAverage: number
}
