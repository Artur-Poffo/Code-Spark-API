import { type UseCaseError } from '@/core/errors/use-case-error'

export class TagAlreadyAttachedError extends Error implements UseCaseError {
  constructor({ tagId, courseId }: { tagId: string, courseId: string }) {
    super(`Tag "${tagId}" already attached for the course: ${courseId}.`)
  }
}
