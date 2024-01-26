import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Course } from '../course'
import { type InstructorDTO } from './instructor'

export interface InstructorWithCoursesDTO {
  instructorId: UniqueEntityID
  instructor: InstructorDTO
  courses: Course[]
}
