import { type UseCaseError } from '@/core/errors/use-case-error'

export class ModuleAlreadyExistsInThisCourseError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Module "${identifier}" already exists in this course.`)
  }
}
