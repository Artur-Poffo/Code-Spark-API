import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCancelEnrollmentUseCase } from '@/infra/use-cases/factories/make-cancel-enrollment-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const cancelEnrollmentParamsSchema = z.object({
  enrollmentId: z.string().uuid()
})

export async function cancelEnrollmentController(request: FastifyRequest, reply: FastifyReply) {
  const { enrollmentId } = cancelEnrollmentParamsSchema.parse(request.params)
  const { sub: studentId } = request.user

  const cancelEnrollmentUseCase = makeCancelEnrollmentUseCase()

  const result = await cancelEnrollmentUseCase.exec({
    enrollmentId,
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

  return await reply.status(204).send()
}
