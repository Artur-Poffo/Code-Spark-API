import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeDeleteCourseUseCase } from '@/infra/use-cases/factories/make-delete-course-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const deleteCourseParamsSchema = z.object({
  courseId: z.string()
})

export async function deleteCourseController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = deleteCourseParamsSchema.parse(request.params)
  const { sub: instructorId } = request.user

  const DeleteCourseUseCase = makeDeleteCourseUseCase()

  const result = await DeleteCourseUseCase.exec({
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

  return await reply.status(204).send()
}
