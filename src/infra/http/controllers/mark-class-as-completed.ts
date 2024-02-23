import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeMarkClassAsCompletedUseCase } from '@/infra/use-cases/factories/make-mark-class-as-completed-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const markClassAsCompletedParamsSchema = z.object({
  enrollmentId: z.string().uuid(),
  classId: z.string().uuid()
})

export async function markClassAsCompletedController(request: FastifyRequest, reply: FastifyReply) {
  const { enrollmentId, classId } = markClassAsCompletedParamsSchema.parse(request.params)
  const { sub: studentId } = request.user

  const markClassAsCompletedUseCase = makeMarkClassAsCompletedUseCase()

  const result = await markClassAsCompletedUseCase.exec({
    enrollmentId,
    classId,
    studentId
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

  return await reply.status(201).send()
}
