import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { EnrollmentCompletedItemMapper } from '@/infra/database/prisma/mappers/enrollment-completed-item-mapper'
import { makeFetchEnrollmentCompletedClassesUseCase } from '@/infra/use-cases/factories/make-fetch-enrollment-completed-classes-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { EnrollmentCompletedItemPresenter } from '../presenters/enrollment-completed-item-presenter'

const fetchEnrollmentCompletedClassesParamsSchema = z.object({
  enrollmentId: z.string().uuid()
})

export async function fetchEnrollmentCompletedClassesController(request: FastifyRequest, reply: FastifyReply) {
  const { enrollmentId } = fetchEnrollmentCompletedClassesParamsSchema.parse(request.params)

  const fetchEnrollmentCompletedClassesUseCase = makeFetchEnrollmentCompletedClassesUseCase()

  const result = await fetchEnrollmentCompletedClassesUseCase.exec({
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

  const completedClasses = result.value.completedClasses

  const infraCompletedClasses = completedClasses.map(completedClass => {
    return EnrollmentCompletedItemMapper.toPrisma(completedClass)
  })

  return await reply.status(200).send({
    completedClasses: infraCompletedClasses.map(infraCompletedClass => {
      return EnrollmentCompletedItemPresenter.toHTTP(infraCompletedClass)
    })
  })
}
