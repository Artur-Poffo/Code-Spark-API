import { type CourseDTO } from './course'
import { type InstructorDTO } from './instructor'
import { type ModuleWithClassesAndStudentProgressDTO } from './module-with-classes-and-student-progress'

export interface CompleteCourseWithStudentProgressDTO {
  course: CourseDTO
  instructor: InstructorDTO
  modules: ModuleWithClassesAndStudentProgressDTO[]
}
