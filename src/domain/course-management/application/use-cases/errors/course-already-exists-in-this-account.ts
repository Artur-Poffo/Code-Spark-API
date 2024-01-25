import { type UseCaseError } from '@/core/errors/use-case-error'

export class CourseAlreadyExistsInThisAccount extends Error implements UseCaseError {
  constructor(instructorEmail: string) {
    super(`Course already exists in this account, account email: ${instructorEmail}.`)
  }
}
