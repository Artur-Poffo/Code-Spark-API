import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeGetCourseStatsUseCase } from '@/infra/use-cases/factories/make-get-course-stats-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const getCourseStatsParamsSchema = z.object({
  courseId: z.string().uuid()
})

export async function getCourseStatsController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = getCourseStatsParamsSchema.parse(request.params)

  const getCourseStatsUseCase = makeGetCourseStatsUseCase()

  const result = await getCourseStatsUseCase.exec({
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

  return await reply.status(200).send({
    stats: {
      ...result.value
    }
  })
}
