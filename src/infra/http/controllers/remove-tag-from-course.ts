import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeRemoveTagFromCourseUseCase } from '@/infra/use-cases/factories/make-remove-tag-from-course-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const removeTagFromCourseParamsSchema = z.object({
  courseId: z.string().uuid(),
  tagId: z.string().uuid()
})

export async function removeTagFromCourseController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId, tagId } = removeTagFromCourseParamsSchema.parse(request.params)
  const { sub: instructorId } = request.user

  const RemoveTagFromCourseUseCase = makeRemoveTagFromCourseUseCase()

  const result = await RemoveTagFromCourseUseCase.exec({
    tagId,
    courseId,
    instructorId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case NotAllowedError:
        return await reply.status(401).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  return await reply.status(204).send()
}
