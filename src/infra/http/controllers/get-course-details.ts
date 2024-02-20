import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourseMapper } from '@/infra/database/prisma/mappers/factories/make-course-mapper'
import { makeGetCourseDetailsUseCase } from '@/infra/use-cases/factories/make-get-course-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CoursePresenter } from '../presenters/course-presenter'

const getCourseDetailsParamsSchema = z.object({
  courseId: z.string().uuid()
})

export async function getCourseDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = getCourseDetailsParamsSchema.parse(request.params)

  const getCourseDetailsUseCase = makeGetCourseDetailsUseCase()

  const result = await getCourseDetailsUseCase.exec({
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

  const courseMapper = makeCourseMapper()
  const course = await courseMapper.toPrisma(result.value.course)

  return await reply.status(200).send({
    course: CoursePresenter.toHTTP(course)
  })
}
