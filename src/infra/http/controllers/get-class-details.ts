import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeClassMapper } from '@/infra/database/prisma/mappers/factories/make-class-mapper'
import { makeGetClassDetailsUseCase } from '@/infra/use-cases/factories/make-get-class-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ClassPresenter } from '../presenters/class-presenter'

const getClassDetailsParamsSchema = z.object({
  classId: z.string().uuid()
})

export async function getClassDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { classId } = getClassDetailsParamsSchema.parse(request.params)

  const getClassDetailsUseCase = makeGetClassDetailsUseCase()

  const result = await getClassDetailsUseCase.exec({
    classId
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

  const classMapper = makeClassMapper()
  const classToSend = await classMapper.toPrisma(result.value.class)

  return await reply.status(200).send({
    class: ClassPresenter.toHTTP(classToSend)
  })
}
