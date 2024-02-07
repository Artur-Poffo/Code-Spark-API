import { type Class } from '../class'
import { type ModuleDTO } from './module'

interface ModuleWithProgress extends ModuleDTO {
  completed: boolean
}

interface ClassWithProgress extends Class {
  completed: boolean
}

export interface ModuleWithClassesAndStudentProgressDTO {
  module: ModuleWithProgress
  classes: ClassWithProgress[]
}
