import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeUserMapper } from '@/infra/database/prisma/mappers/factories/make-user-mapper'
import { makeGetUserInfoUseCase } from '@/infra/use-cases/factories/make-get-user-info-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { UserPresenter } from '../presenters/user-presenter'

export async function getAuthenticatedUserDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user

  const getUserInfoUseCase = makeGetUserInfoUseCase()

  const result = await getUserInfoUseCase.exec({
    id: userId
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

  const userMapper = makeUserMapper()
  const user = await userMapper.toPrisma(result.value.user)

  return await reply.status(200).send({
    user: UserPresenter.toHTTP(user)
  })
}
