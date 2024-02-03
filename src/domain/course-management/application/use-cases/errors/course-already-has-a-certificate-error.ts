import { type UseCaseError } from '@/core/errors/use-case-error'

export class CourseAlreadyHasACertificateError extends Error implements UseCaseError {
  constructor(courseId: string) {
    super(`Course: ${courseId} already has a certificate`)
  }
}
