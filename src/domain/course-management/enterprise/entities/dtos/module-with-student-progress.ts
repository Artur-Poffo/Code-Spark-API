import { type ModuleDTO } from './module'

export interface ModuleWithStudentProgressDTO {
  module: ModuleDTO
  completed: boolean
}
