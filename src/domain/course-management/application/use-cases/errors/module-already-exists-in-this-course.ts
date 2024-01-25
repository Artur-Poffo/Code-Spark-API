import { type UseCaseError } from '@/core/errors/use-case-error'

export class ModuleAlreadyExistsInThisCourse extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Module "${identifier}" already exists in this course.`)
  }
}
