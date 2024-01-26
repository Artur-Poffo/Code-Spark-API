import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Class } from '../class'
import { type Module } from '../module'
import { type InstructorDTO } from './instructor'

export interface CompleteCourseDTO {
  courseId: UniqueEntityID
  instructorId: UniqueEntityID
  instructor: InstructorDTO
  modules: Module[]
  classes: Class[]
}
