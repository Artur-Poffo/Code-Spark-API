import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AllModulesInTheCourseMustBeMarkedAsCompleted } from '@/domain/course-management/application/use-cases/errors/all-modules-in-the-course-must-be-marked-as-completed'
import { makeMarkCourseAsCompletedUseCase } from '@/infra/use-cases/factories/make-mark-course-as-completed-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const markCourseAsCompletedParamsSchema = z.object({
  enrollmentId: z.string().uuid()
})

export async function markCourseAsCompletedController(request: FastifyRequest, reply: FastifyReply) {
  const { enrollmentId } = markCourseAsCompletedParamsSchema.parse(request.params)
  const { sub: studentId } = request.user

  const markCourseAsCompletedUseCase = makeMarkCourseAsCompletedUseCase()

  const result = await markCourseAsCompletedUseCase.exec({
    enrollmentId,
    studentId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case NotAllowedError:
        return await reply.status(401).send({ message: error.message })
      case AllModulesInTheCourseMustBeMarkedAsCompleted:
        return await reply.status(403).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  return await reply.status(201).send()
}
