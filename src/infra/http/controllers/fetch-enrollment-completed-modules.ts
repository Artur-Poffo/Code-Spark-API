import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { EnrollmentCompletedItemMapper } from '@/infra/database/prisma/mappers/enrollment-completed-item-mapper'
import { makeFetchEnrollmentCompletedModulesUseCase } from '@/infra/use-cases/factories/make-fetch-enrollment-completed-modules-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { EnrollmentCompletedItemPresenter } from '../presenters/enrollment-completed-item-presenter'

const fetchEnrollmentCompletedModulesParamsSchema = z.object({
  enrollmentId: z.string().uuid()
})

export async function fetchEnrollmentCompletedModulesController(request: FastifyRequest, reply: FastifyReply) {
  const { enrollmentId } = fetchEnrollmentCompletedModulesParamsSchema.parse(request.params)

  const fetchEnrollmentCompletedModulesUseCase = makeFetchEnrollmentCompletedModulesUseCase()

  const result = await fetchEnrollmentCompletedModulesUseCase.exec({
    enrollmentId
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

  const completedModules = result.value.completedModules

  const infraCompletedModules = completedModules.map(completedModule => {
    return EnrollmentCompletedItemMapper.toPrisma(completedModule)
  })

  return await reply.status(200).send({
    completedModules: infraCompletedModules.map(infraCompletedModule => {
      return EnrollmentCompletedItemPresenter.toHTTP(infraCompletedModule)
    })
  })
}
