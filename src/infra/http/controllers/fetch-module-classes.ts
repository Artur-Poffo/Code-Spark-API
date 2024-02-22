import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type Class } from '@/domain/course-management/enterprise/entities/class'
import { makeClassMapper } from '@/infra/database/prisma/mappers/factories/make-class-mapper'
import { makeFetchModuleClassesUseCase } from '@/infra/use-cases/factories/make-fetch-module-classes-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ClassPresenter } from '../presenters/class-presenter'

const fetchModuleClassesParamsSchema = z.object({
  moduleId: z.string()
})

export async function fetchModuleClassesController(request: FastifyRequest, reply: FastifyReply) {
  const { moduleId } = fetchModuleClassesParamsSchema.parse(request.params)

  const fetchModuleClassesUseCase = makeFetchModuleClassesUseCase()

  const result = await fetchModuleClassesUseCase.exec({
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

  const classMapper = makeClassMapper()
  const { classes } = result.value

  const infraClasses = await Promise.all(
    classes.map(async (classToMap: Class) => {
      return await classMapper.toPrisma(classToMap)
    })
  )

  return await reply.status(200).send({
    classes: infraClasses.map(infraClass => ClassPresenter.toHTTP(infraClass))
  })
}
