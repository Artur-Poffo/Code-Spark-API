import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeGetCourseMetricsUseCase } from '@/infra/use-cases/factories/make-get-course-metrics-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const getCourseMetricsParamsSchema = z.object({
  courseId: z.string().uuid()
})

export async function getCourseMetricsController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = getCourseMetricsParamsSchema.parse(request.params)
  const { sub: instructorId } = request.user

  const getCourseMetricsUseCase = makeGetCourseMetricsUseCase()

  const result = await getCourseMetricsUseCase.exec({
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

  return await reply.status(200).send({
    metrics: {
      ...result.value
    }
  })
}
