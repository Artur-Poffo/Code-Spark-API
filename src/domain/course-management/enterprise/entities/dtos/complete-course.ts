import { type CourseDTO } from './course'
import { type InstructorDTO } from './instructor'
import { type ModuleWithClassesDTO } from './module-with-classes'

export interface CompleteCourseDTO {
  course: CourseDTO
  instructor: InstructorDTO
  modules: ModuleWithClassesDTO[]
}
