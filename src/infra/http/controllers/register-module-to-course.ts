import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ModuleAlreadyExistsInThisCourseError } from '@/domain/course-management/application/use-cases/errors/module-already-exists-in-this-course-error'
import { ModuleNumberIsAlreadyInUseError } from '@/domain/course-management/application/use-cases/errors/module-number-already-in-use-error'
import { makeRegisterModuleToCourseUseCase } from '@/infra/use-cases/factories/make-register-module-to-course-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const registerModuleToCourseBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  moduleNumber: z.number()
})

const registerModuleToCourseParamsSchema = z.object({
  courseId: z.string().uuid()
})

export async function registerModuleToCourseController(request: FastifyRequest, reply: FastifyReply) {
  const { name, description, moduleNumber } = registerModuleToCourseBodySchema.parse(request.body)
  const { courseId } = registerModuleToCourseParamsSchema.parse(request.params)
  const { sub: instructorId } = request.user

  const registerModuleToCourseUseCase = makeRegisterModuleToCourseUseCase()

  const result = await registerModuleToCourseUseCase.exec({
    name,
    description,
    instructorId,
    moduleNumber,
    courseId
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case ResourceNotFoundError:
        return await reply.status(404).send({ message: error.message })
      case ModuleAlreadyExistsInThisCourseError:
        return await reply.status(409).send({ message: error.message })
      case ModuleNumberIsAlreadyInUseError:
        return await reply.status(409).send({ message: error.message })
      case NotAllowedError:
        return await reply.status(401).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  return await reply.status(201).send()
}
