import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CourseAlreadyHasACertificateError } from '@/domain/course-management/application/use-cases/errors/course-already-has-a-certificate-error'
import { makeRegisterCertificateForCourseUseCase } from '@/infra/use-cases/factories/make-register-certificate-for-course-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const registerCertificateForCourseParamsSchema = z.object({
  courseId: z.string().uuid(),
  imageId: z.string().uuid()
})

export async function registerCertificateForCourseController(request: FastifyRequest, reply: FastifyReply) {
  const { courseId, imageId } = registerCertificateForCourseParamsSchema.parse(request.params)
  const { sub: instructorId } = request.user

  const getVideoInfoUseCase = makeRegisterCertificateForCourseUseCase()

  const result = await getVideoInfoUseCase.exec({
    courseId,
    imageId,
    instructorId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case NotAllowedError:
        return await reply.status(401).send({ message: error.message })
      case CourseAlreadyHasACertificateError:
        return await reply.status(409).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  return await reply.status(201).send()
}
