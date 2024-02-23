import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InvalidEvaluationValueError } from '@/domain/course-management/application/use-cases/errors/invalid-evaluation-value-error'
import { StudentAlreadyEvaluateThisClassError } from '@/domain/course-management/application/use-cases/errors/student-already-evaluate-this-class-error'
import { StudentMustBeRegisteredToEvaluateError } from '@/domain/course-management/application/use-cases/errors/student-must-be-registered-to-evaluate-error'
import { EvaluationMapper } from '@/infra/database/prisma/mappers/evaluation-mapper'
import { makeEvaluateClassUseCase } from '@/infra/use-cases/factories/make-evaluate-class-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { EvaluationPresenter } from '../presenters/evaluation-presenter'

const evaluateClassBodySchema = z.object({
  value: z.number().min(1).max(5)
})

const evaluateClassParamsSchema = z.object({
  courseId: z.string().uuid(),
  classId: z.string().uuid()
})

export async function evaluateClassController(request: FastifyRequest, reply: FastifyReply) {
  const { value } = evaluateClassBodySchema.parse(request.body)
  const { courseId, classId } = evaluateClassParamsSchema.parse(request.params)

  const { sub: studentId } = request.user

  const evaluateClassUseCase = makeEvaluateClassUseCase()

  const result = await evaluateClassUseCase.exec({
    value,
    studentId,
    courseId,
    classId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case InvalidEvaluationValueError:
        return await reply.status(403).send({ message: error.message })
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case StudentAlreadyEvaluateThisClassError:
        return await reply.status(409).send({ message: error.message })
      case StudentMustBeRegisteredToEvaluateError:
        return await reply.status(401).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  const { evaluation } = result.value

  const infraEvaluation = EvaluationMapper.toPrisma(evaluation)

  return await reply.status(200).send({
    evaluation: EvaluationPresenter.toHTTP(infraEvaluation)
  })
}
