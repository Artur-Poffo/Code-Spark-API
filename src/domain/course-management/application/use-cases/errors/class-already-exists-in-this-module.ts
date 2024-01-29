import { type UseCaseError } from '@/core/errors/use-case-error'

export class ClassAlreadyExistsInThisModule extends Error implements UseCaseError {
  constructor(moduleId: string) {
    super(`Class already exists in this module: module ID ${moduleId}.`)
  }
}
