import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type Class } from '@/domain/course-management/enterprise/entities/class'
import { makeClassMapper } from '@/infra/database/prisma/mappers/factories/make-class-mapper'
import { makeFetchCourseClassesUseCase } from '@/infra/use-cases/factories/make-fetch-course-classes-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ClassPresenter } from '../presenters/class-presenter'

const fetchCourseClassesParamsSchema = z.object({
  courseId: z.string()
})

export async function fetchCourseClassesController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = fetchCourseClassesParamsSchema.parse(request.params)

  const fetchCourseClassesUseCase = makeFetchCourseClassesUseCase()

  const result = await fetchCourseClassesUseCase.exec({
    courseId
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
