import { type UseCaseError } from '@/core/errors/use-case-error'

export class AllClassesInTheModuleMustBeMarkedAsCompleted extends Error implements UseCaseError {
  constructor(moduleName: string) {
    super(`All classes in the module: ${moduleName}, must be marked as completed`)
  }
}
