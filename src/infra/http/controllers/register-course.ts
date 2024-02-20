import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CourseAlreadyExistsInThisAccountError } from '@/domain/course-management/application/use-cases/errors/course-already-exists-in-this-account-error'
import { makeRegisterCourseUseCase } from '@/infra/use-cases/factories/make-register-course-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const registerCourseBodySchema = z.object({
  name: z.string(),
  description: z.string()
})

export async function registerCourseController(request: FastifyRequest, reply: FastifyReply) {
  const { name, description } = registerCourseBodySchema.parse(request.body)

  const registerCourseUseCase = makeRegisterCourseUseCase()

  const result = await registerCourseUseCase.exec({
    name,
    description,
    instructorId: request.user.sub
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case CourseAlreadyExistsInThisAccountError:
        return await reply.status(409).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  return await reply.status(201).send()
}
