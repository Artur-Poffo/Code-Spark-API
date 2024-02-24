import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CertificateHasAlreadyBeenIssued } from '@/domain/course-management/application/use-cases/errors/certificate-has-already-been-issued-error'
import { CompleteTheCourseBeforeTheCertificateIIsIssuedError } from '@/domain/course-management/application/use-cases/errors/complete-the-course-before-the-certificate-is-issued-error'
import { StudentCertificateMapper } from '@/infra/database/prisma/mappers/student-certificate-mapper'
import { makeIssueCertificateUseCase } from '@/infra/use-cases/factories/make-issue-certificate-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { StudentCertificatePresenter } from '../presenters/student-certificate-presenter'

const issueCertificateParamsSchema = z.object({
  enrollmentId: z.string().uuid()
})

export async function issueCertificateController(request: FastifyRequest, reply: FastifyReply) {
  const { enrollmentId } = issueCertificateParamsSchema.parse(request.params)
  const { sub: studentId } = request.user

  const issueCertificateUseCase = makeIssueCertificateUseCase()

  const result = await issueCertificateUseCase.exec({
    enrollmentId,
    studentId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case CertificateHasAlreadyBeenIssued:
        return await reply.status(409).send({ message: error.message })
      case CompleteTheCourseBeforeTheCertificateIIsIssuedError:
        return await reply.status(403).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  const studentCertificate = StudentCertificateMapper.toPrisma(result.value.issuedCertificate)

  return await reply.status(200).send({
    studentCertificate: StudentCertificatePresenter.toHTTP(studentCertificate)
  })
}
