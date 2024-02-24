import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AlreadyEnrolledInThisCourse } from '@/domain/course-management/application/use-cases/errors/already-enrolled-in-this-course'
import { makeEnrollToCourseUseCase } from '@/infra/use-cases/factories/make-enroll-to-course-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const enrollToCourseParamsSchema = z.object({
  courseId: z.string().uuid()
})

export async function enrollToCourseController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = enrollToCourseParamsSchema.parse(request.params)
  const { sub: studentId } = request.user

  const enrollToCourseUseCase = makeEnrollToCourseUseCase()

  const result = await enrollToCourseUseCase.exec({
    studentId,
    courseId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case AlreadyEnrolledInThisCourse:
        return await reply.status(409).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  return await reply.status(201).send()
}
