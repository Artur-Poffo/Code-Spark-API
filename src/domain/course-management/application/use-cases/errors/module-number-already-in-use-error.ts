import { type UseCaseError } from '@/core/errors/use-case-error'

export class ModuleNumberIsAlreadyInUseError extends Error implements UseCaseError {
  constructor(modulePosition: number) {
    super(`Module position ${modulePosition} is already in use`)
  }
}
