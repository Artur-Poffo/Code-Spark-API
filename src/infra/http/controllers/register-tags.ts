import { RepeatedTagError } from '@/domain/course-management/application/use-cases/errors/repeated-tag-error'
import { TagAlreadyExistsError } from '@/domain/course-management/application/use-cases/errors/tag-already-exists-error'
import { makeRegisterTagUseCase } from '@/infra/use-cases/factories/make-register-tag-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const registerTagsBodySchema = z.object({
  tags: z.array(z.string())
})

export async function registerTagsController(request: FastifyRequest, reply: FastifyReply) {
  const { tags } = registerTagsBodySchema.parse(request.body)

  const registerTagUseCase = makeRegisterTagUseCase()

  const result = await registerTagUseCase.exec({
    tags
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case RepeatedTagError:
        return await reply.status(409).send({ message: error.message })
      case TagAlreadyExistsError:
        return await reply.status(409).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  return await reply.status(201).send()
}
