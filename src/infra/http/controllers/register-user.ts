import { InstructorAlreadyExistsError } from '@/domain/course-management/application/use-cases/errors/instructor-already-exists-error'
import { StudentAlreadyExistsError } from '@/domain/course-management/application/use-cases/errors/student-already-exists-error'
import { makeRegisterInstructorUseCase } from '@/infra/use-cases/factories/make-register-instructor-use-case'
import { makeRegisterStudentUseCase } from '@/infra/use-cases/factories/make-register-student-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const registerUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  age: z.number(),
  cpf: z.string(),
  role: z.enum(['STUDENT', 'INSTRUCTOR']),
  summary: z.string()
})

export async function registerUserController(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password, age, cpf, role, summary } = registerUserBodySchema.parse(request.body)

  if (role === 'STUDENT') {
    const registerStudentUseCase = makeRegisterStudentUseCase()

    const result = await registerStudentUseCase.exec({
      name,
      email,
      password,
      age,
      cpf,
      summary
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          return await reply.status(409).send({ message: error.message })
        default:
          return await reply.status(500).send({ message: error.message })
      }
    }

    return await reply.status(201).send()
  }

  if (role === 'INSTRUCTOR') {
    const registerInstructorUseCase = makeRegisterInstructorUseCase()

    const result = await registerInstructorUseCase.exec({
      name,
      email,
      password,
      age,
      cpf,
      summary
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InstructorAlreadyExistsError:
          return await reply.status(409).send({ message: error.message })
        default:
          return await reply.status(500).send({ message: error.message })
      }
    }

    return await reply.status(201).send()
  }
}
