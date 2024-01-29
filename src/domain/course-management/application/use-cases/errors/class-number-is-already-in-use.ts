import { type UseCaseError } from '@/core/errors/use-case-error'

export class ClassNumberIsAlreadyInUse extends Error implements UseCaseError {
  constructor(classPosition: number) {
    super(`Class position ${classPosition} is already in use`)
  }
}
