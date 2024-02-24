import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeDeleteUserUseCase } from '@/infra/use-cases/factories/make-delete-user-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function deleteUserController(request: FastifyRequest, reply: FastifyReply) {
  const DeleteUserUseCase = makeDeleteUserUseCase()

  const result = await DeleteUserUseCase.exec({
    userId: request.user.sub
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  return await reply.status(204).send()
}
