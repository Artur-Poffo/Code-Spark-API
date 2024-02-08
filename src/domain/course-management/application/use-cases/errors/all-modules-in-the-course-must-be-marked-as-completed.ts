import { type UseCaseError } from '@/core/errors/use-case-error'

export class AllModulesInTheCourseMustBeMarkedAsCompleted extends Error implements UseCaseError {
  constructor(courseName: string) {
    super(`All modules in the course: ${courseName}, must be marked as completed`)
  }
}
