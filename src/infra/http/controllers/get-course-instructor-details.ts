import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeInstructorMapper } from '@/infra/database/prisma/mappers/factories/make-instructor-mapper'
import { makeGetCourseInstructorDetailsUseCase } from '@/infra/use-cases/factories/make-get-course-instructor-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserPresenter } from '../presenters/user-presenter'

const getCourseInstructorDetailsParamsSchema = z.object({
  courseId: z.string().uuid()
})

export async function getCourseInstructorDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = getCourseInstructorDetailsParamsSchema.parse(request.params)

  const getCourseInstructorDetailsUseCase = makeGetCourseInstructorDetailsUseCase()

  const result = await getCourseInstructorDetailsUseCase.exec({
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

  const instructorMapper = makeInstructorMapper()
  const instructor = await instructorMapper.toPrisma(result.value.instructor)

  return await reply.status(200).send({
    instructor: UserPresenter.toHTTP(instructor)
  })
}
