import { type UseCaseError } from '@/core/errors/use-case-error'

export class AlreadyEnrolledInThisCourse extends Error implements UseCaseError {
  constructor(courseName: string) {
    super(`Already Enrolled in this course: ${courseName}.`)
  }
}
