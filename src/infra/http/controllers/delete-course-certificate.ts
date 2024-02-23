import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeDeleteCourseCertificateUseCase } from '@/infra/use-cases/factories/make-delete-course-certificate-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const deleteCourseCertificateParamsSchema = z.object({
  courseId: z.string().uuid(),
  certificateId: z.string().uuid()
})

export async function deleteCourseCertificateController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId, certificateId } = deleteCourseCertificateParamsSchema.parse(request.params)
  const { sub: instructorId } = request.user

  const DeleteCourseCertificateUseCase = makeDeleteCourseCertificateUseCase()

  const result = await DeleteCourseCertificateUseCase.exec({
    courseId,
    certificateId,
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
