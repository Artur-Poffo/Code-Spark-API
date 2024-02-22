import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ClassAlreadyExistsInThisModuleError } from '@/domain/course-management/application/use-cases/errors/class-already-exists-in-this-module-error'
import { ClassNumberIsAlreadyInUseError } from '@/domain/course-management/application/use-cases/errors/class-number-is-already-in-use-error'
import { ClassVideoRequiredError } from '@/domain/course-management/application/use-cases/errors/class-video-required-error'
import { makeClassMapper } from '@/infra/database/prisma/mappers/factories/make-class-mapper'
import { makeAddClassToModuleUseCase } from '@/infra/use-cases/factories/make-add-class-to-module-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ClassPresenter } from '../presenters/class-presenter'

const addClassToModuleBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  classNumber: z.number()
})

const addClassToModuleParamsSchema = z.object({
  moduleId: z.string(),
  videoId: z.string()
})

export async function addClassToModuleController(request: FastifyRequest, reply: FastifyReply) {
  const { name, description, classNumber } = addClassToModuleBodySchema.parse(request.body)
  const { moduleId, videoId } = addClassToModuleParamsSchema.parse(request.params)

  const { sub: instructorId } = request.user

  const addClassToModuleUseCase = makeAddClassToModuleUseCase()

  const result = await addClassToModuleUseCase.exec({
    name,
    description,
    classNumber,
    moduleId,
    videoId,
    instructorId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case NotAllowedError:
        return await reply.status(401).send({ message: error.message })
      case ClassAlreadyExistsInThisModuleError:
        return await reply.status(409).send({ message: error.message })
      case ClassNumberIsAlreadyInUseError:
        return await reply.status(409).send({ message: error.message })
      case ClassVideoRequiredError:
        return await reply.status(404).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  const classMapper = makeClassMapper()
  const { class: classToReply } = result.value

  const infraClass = await classMapper.toPrisma(classToReply)

  return await reply.status(200).send({
    Class: ClassPresenter.toHTTP(infraClass)
  })
}
