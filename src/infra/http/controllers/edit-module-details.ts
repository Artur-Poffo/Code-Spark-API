import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ModuleNumberIsAlreadyInUseError } from '@/domain/course-management/application/use-cases/errors/module-number-already-in-use-error'
import { makeModuleMapper } from '@/infra/database/prisma/mappers/factories/make-module-mapper'
import { makeEditModuleDetailsUseCase } from '@/infra/use-cases/factories/make-edit-module-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ModulePresenter } from '../presenters/module-presenter'

const editModuleDetailsBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  moduleNumber: z.number().optional()
})

const editModuleDetailsParamsSchema = z.object({
  moduleId: z.string()
})

export async function editModuleDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { name, description, moduleNumber } = editModuleDetailsBodySchema.parse(request.body)
  const { moduleId } = editModuleDetailsParamsSchema.parse(request.params)

  const { sub: instructorId } = request.user

  const editModuleDetailsUseCase = makeEditModuleDetailsUseCase()

  const result = await editModuleDetailsUseCase.exec({
    name,
    description,
    moduleNumber,
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
      case ModuleNumberIsAlreadyInUseError:
        return await reply.status(409).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  const moduleMapper = makeModuleMapper()
  const { module } = result.value

  const infraModule = await moduleMapper.toPrisma(module)

  return await reply.status(200).send({
    Module: ModulePresenter.toHTTP(infraModule)
  })
}
