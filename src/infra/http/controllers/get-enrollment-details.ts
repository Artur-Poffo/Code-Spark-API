import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeEnrollmentMapper } from '@/infra/database/prisma/mappers/factories/make-enrollment-mapper'
import { makeGetEnrollmentDetailsUseCase } from '@/infra/use-cases/factories/make-get-enrollment-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { EnrollmentPresenter } from '../presenters/enrollment-presenter'

const getEnrollmentDetailsParamsSchema = z.object({
  courseId: z.string().uuid(),
  studentId: z.string().uuid()
})

export async function getEnrollmentDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId, studentId } = getEnrollmentDetailsParamsSchema.parse(request.params)

  const getEnrollmentDetailsUseCase = makeGetEnrollmentDetailsUseCase()

  const result = await getEnrollmentDetailsUseCase.exec({
    courseId,
    studentId
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

  const enrollmentMapper = makeEnrollmentMapper()
  const { enrollment } = result.value

  const infraEnrollment = await enrollmentMapper.toPrisma(enrollment)

  return await reply.status(200).send({
    enrollment: EnrollmentPresenter.toHTTP(infraEnrollment)
  })
}
