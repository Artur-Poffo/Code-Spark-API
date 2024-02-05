import { type Class } from '../class'
import { type ModuleDTO } from './module'

export interface ModuleWithClassesDTO {
  module: ModuleDTO
  classes: Class[]
}
