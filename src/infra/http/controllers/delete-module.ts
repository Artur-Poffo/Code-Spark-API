import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeDeleteModuleUseCase } from '@/infra/use-cases/factories/make-delete-module-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const deleteModuleParamsSchema = z.object({
  moduleId: z.string().uuid()
})

export async function deleteModuleController(request: FastifyRequest, reply: FastifyReply) {
  const { moduleId } = deleteModuleParamsSchema.parse(request.params)
  const { sub: instructorId } = request.user

  const DeleteModuleUseCase = makeDeleteModuleUseCase()

  const result = await DeleteModuleUseCase.exec({
    moduleId,
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
