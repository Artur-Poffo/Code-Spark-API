import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { RepeatedTagError } from '@/domain/course-management/application/use-cases/errors/repeated-tag-error'
import { TagAlreadyAttachedError } from '@/domain/course-management/application/use-cases/errors/tag-already-attached-error'
import { makeAttachTagToCourseUseCase } from '@/infra/use-cases/factories/make-attach-tag-to-course-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const attachTagsToCourseBodySchema = z.object({
  tagIds: z.array(z.string().uuid())
})

const attachTagsToCourseParamsSchema = z.object({
  courseId: z.string()
})

export async function attachTagsToCourseController(request: FastifyRequest, reply: FastifyReply) {
  const { tagIds } = attachTagsToCourseBodySchema.parse(request.body)
  const { courseId } = attachTagsToCourseParamsSchema.parse(request.params)

  const { sub: instructorId } = request.user

  const attachTagsToCourseUseCase = makeAttachTagToCourseUseCase()

  const result = await attachTagsToCourseUseCase.exec({
    tagIds,
    courseId,
    instructorId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case RepeatedTagError:
        return await reply.status(409).send({ message: error.message })
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case NotAllowedError:
        return await reply.status(401).send({ message: error.message })
      case TagAlreadyAttachedError:
        return await reply.status(409).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  return await reply.status(201).send()
}
