import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ClassNumberIsAlreadyInUseError } from '@/domain/course-management/application/use-cases/errors/class-number-is-already-in-use-error'
import { makeClassMapper } from '@/infra/database/prisma/mappers/factories/make-class-mapper'
import { makeEditClassDetailsUseCase } from '@/infra/use-cases/factories/make-edit-class-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ClassPresenter } from '../presenters/class-presenter'

const editClassDetailsBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  classNumber: z.number().optional(),
  videoId: z.string().uuid().optional()
})

const editClassDetailsParamsSchema = z.object({
  classId: z.string()
})

export async function editClassDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { name, description, classNumber, videoId } = editClassDetailsBodySchema.parse(request.body)
  const { classId } = editClassDetailsParamsSchema.parse(request.params)

  const { sub: instructorId } = request.user

  const editClassDetailsUseCase = makeEditClassDetailsUseCase()

  const result = await editClassDetailsUseCase.exec({
    name,
    description,
    classNumber,
    videoId,
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
      case ClassNumberIsAlreadyInUseError:
        return await reply.status(409).send({ message: error.message })
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
