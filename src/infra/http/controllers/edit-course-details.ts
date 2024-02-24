import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourseMapper } from '@/infra/database/prisma/mappers/factories/make-course-mapper'
import { makeEditCourseDetailsUseCase } from '@/infra/use-cases/factories/make-edit-course-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CoursePresenter } from '../presenters/course-presenter'

const editCourseDetailsBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  coverImageKey: z.string().optional(),
  bannerImageKey: z.string().optional()
})

const editCourseDetailsParamsSchema = z.object({
  courseId: z.string().uuid()
})

export async function editCourseDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { name, description, coverImageKey, bannerImageKey } = editCourseDetailsBodySchema.parse(request.body)
  const { courseId } = editCourseDetailsParamsSchema.parse(request.params)

  const { sub: instructorId } = request.user

  const editCourseDetailsUseCase = makeEditCourseDetailsUseCase()

  const result = await editCourseDetailsUseCase.exec({
    name,
    description,
    coverImageKey,
    bannerImageKey,
    courseId,
    instructorId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case NotAllowedError:
        return await reply.status(401).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  const courseMapper = makeCourseMapper()
  const { course } = result.value

  const infraCourse = await courseMapper.toPrisma(course)

  return await reply.status(200).send({
    course: CoursePresenter.toHTTP(infraCourse)
  })
}
