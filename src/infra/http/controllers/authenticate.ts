import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'
import { makeAuthenticateUserUseCase } from '@/infra/use-cases/factories/make-authenticate-user-use-case'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

const authenticateUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export async function authenticateUserController(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = authenticateUserBodySchema.parse(request.body)

  const authenticateUserUseCase = makeAuthenticateUserUseCase(reply)

  const result = await authenticateUserUseCase.exec({
    email,
    password
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case WrongCredentialsError:
        return await reply.status(401).send({ message: error.message })
      default:
        return await reply.status(500).send({ message: error.message })
    }
  }

  const { accessToken } = result.value

  return await
  reply
    .status(200)
    .setCookie('spark.accesstoken', accessToken, {
      maxAge: 60 * 60 * 24 // One day
    })
    .send({
      accessToken
    })
}
