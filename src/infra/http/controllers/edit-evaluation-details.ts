import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { EvaluationMapper } from '@/infra/database/prisma/mappers/evaluation-mapper'
import { makeEditEvaluationDetailsUseCase } from '@/infra/use-cases/factories/make-edit-evaluation-details-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { EvaluationPresenter } from '../presenters/evaluation-presenter'

const editEvaluationDetailsBodySchema = z.object({
  value: z.number().min(1).max(5)
})

const editEvaluationDetailsParamsSchema = z.object({
  evaluationId: z.string().uuid()
})

export async function editEvaluationDetailsController(request: FastifyRequest, reply: FastifyReply) {
  const { value } = editEvaluationDetailsBodySchema.parse(request.body)
  const { evaluationId } = editEvaluationDetailsParamsSchema.parse(request.params)

  const { sub: studentId } = request.user

  const editEvaluationDetailsUseCase = makeEditEvaluationDetailsUseCase()

  const result = await editEvaluationDetailsUseCase.exec({
    value,
    evaluationId,
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

  const { evaluation } = result.value

  const infraEvaluation = EvaluationMapper.toPrisma(evaluation)

  return await reply.status(200).send({
    evaluation: EvaluationPresenter.toHTTP(infraEvaluation)
  })
}
