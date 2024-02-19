import { AuthenticateUserUseCase } from '@/domain/course-management/application/use-cases/authenticate-user'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JWTEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { makePrismaUsersRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-users-repository'
import { type FastifyReply } from 'fastify'

export function makeAuthenticateUserUseCase(reply: FastifyReply) {
  const prismaUsersRepository = makePrismaUsersRepository()
  const bcryptHasher = new BcryptHasher()
  const jwtEncrypter = new JWTEncrypter(reply)

  const authenticateUserUseCase = new AuthenticateUserUseCase(
    prismaUsersRepository,
    bcryptHasher,
    jwtEncrypter
  )

  return authenticateUserUseCase
}
