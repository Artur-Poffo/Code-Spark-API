import { type Module } from '../module'
import { type CourseDTO } from './course'

export interface CourseWithModulesDTO {
  course: CourseDTO
  modules: Module[]
}
