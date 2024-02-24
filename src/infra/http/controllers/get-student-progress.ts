import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeGetStudentProgressUseCase } from '@/infra/use-cases/factories/make-get-student-progress-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ClassWithStudentProgressPresenter } from '../presenters/class-with-student-progress-presenter'
import { ModuleWithStudentProgressPresenter } from '../presenters/module-with-student-progress-presenter'

const getStudentProgressParamsSchema = z.object({
  enrollmentId: z.string().uuid()
})

export async function getStudentProgressController(request: FastifyRequest, reply: FastifyReply) {
  const { enrollmentId } = getStudentProgressParamsSchema.parse(request.params)
  const { sub: studentId } = request.user

  const getStudentProgressUseCase = makeGetStudentProgressUseCase()

  const result = await getStudentProgressUseCase.exec({
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
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  const { modules, classes } = result.value

  return await reply.status(200).send({
    classes: classes.map(classWithProgress => ClassWithStudentProgressPresenter.toHTTP(classWithProgress)),
    modules: modules.map(moduleWithProgress => ModuleWithStudentProgressPresenter.toHTTP(moduleWithProgress))
  })
}
