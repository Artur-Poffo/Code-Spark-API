import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeDeleteClassUseCase } from '@/infra/use-cases/factories/make-delete-class-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const deleteClassParamsSchema = z.object({
  classId: z.string().uuid()
})

export async function deleteClassController(request: FastifyRequest, reply: FastifyReply) {
  const { classId } = deleteClassParamsSchema.parse(request.params)
  const { sub: instructorId } = request.user

  const DeleteClassUseCase = makeDeleteClassUseCase()

  const result = await DeleteClassUseCase.exec({
    classId,
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
