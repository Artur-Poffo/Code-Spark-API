import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeModuleMapper } from '@/infra/database/prisma/mappers/factories/make-module-mapper'
import { makeGetModuleDetailsUseCase } from '@/infra/use-cases/factories/make-get-module-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ModulePresenter } from '../presenters/module-presenter'

const getModuleDetailsParamsSchema = z.object({
  moduleId: z.string().uuid()
})

export async function getModuleDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { moduleId } = getModuleDetailsParamsSchema.parse(request.params)

  const getModuleDetailsUseCase = makeGetModuleDetailsUseCase()

  const result = await getModuleDetailsUseCase.exec({
    moduleId
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

  const moduleMapper = makeModuleMapper()
  const module = await moduleMapper.toPrisma(result.value.module)

  return await reply.status(200).send({
    module: ModulePresenter.toHTTP(module)
  })
}
