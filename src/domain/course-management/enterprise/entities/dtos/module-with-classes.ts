import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Class } from '../class'
import { type ModuleDTO } from './module'

export interface ModuleWithClassesDTO {
  moduleId: UniqueEntityID
  module: ModuleDTO
  classes: Class[]
}
