import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type InstructorDTO } from './instructor'
import { type ModuleWithClassesDTO } from './module-with-classes'

export interface CompleteCourseDTO {
  courseId: UniqueEntityID
  instructorId: UniqueEntityID
  instructor: InstructorDTO
  modules: ModuleWithClassesDTO[]
}
