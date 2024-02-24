import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AllClassesInTheModuleMustBeMarkedAsCompleted } from '@/domain/course-management/application/use-cases/errors/all-classes-in-the-module-must-be-marked-as-completed'
import { makeToggleMarkModuleAsCompletedUseCase } from '@/infra/use-cases/factories/make-toggle-mark-module-as-completed-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const toggleMarkModuleAsCompletedParamsSchema = z.object({
  enrollmentId: z.string().uuid(),
  moduleId: z.string().uuid()
})

export async function toggleMarkModuleAsCompletedController(request: FastifyRequest, reply: FastifyReply) {
  const { enrollmentId, moduleId } = toggleMarkModuleAsCompletedParamsSchema.parse(request.params)
  const { sub: studentId } = request.user

  const toggleMarkModuleAsCompletedUseCase = makeToggleMarkModuleAsCompletedUseCase()

  const result = await toggleMarkModuleAsCompletedUseCase.exec({
    enrollmentId,
    moduleId,
    studentId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case NotAllowedError:
        return await reply.status(401).send({ message: error.message })
      case AllClassesInTheModuleMustBeMarkedAsCompleted:
        return await reply.status(403).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  return await reply.status(204).send()
}
