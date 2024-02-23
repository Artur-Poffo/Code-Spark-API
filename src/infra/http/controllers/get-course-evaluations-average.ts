import { makeGetCourseEvaluationsAverageUseCase } from '@/infra/use-cases/factories/make-get-course-evaluations-average-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const getCourseEvaluationsAverageParamsSchema = z.object({
  courseId: z.string().uuid()
})

export async function getCourseEvaluationsAverageController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId } = getCourseEvaluationsAverageParamsSchema.parse(request.params)

  const getCourseEvaluationsAverageUseCase = makeGetCourseEvaluationsAverageUseCase()

  const result = await getCourseEvaluationsAverageUseCase.exec({
    courseId
  })

  if (result.isLeft()) {
    return await reply.status(500).send()
  }

  return await reply.status(200).send({
    evaluationsAverage: result.value.evaluationsAverage.toFixed(2)
  })
}
