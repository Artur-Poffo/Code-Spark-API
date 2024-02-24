import { type ClassDTO } from './class'

export interface ClassWithStudentProgressDTO {
  class: ClassDTO
  completed: boolean
}
