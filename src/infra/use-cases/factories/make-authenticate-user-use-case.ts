import { AuthenticateUserUseCase } from '@/domain/course-management/application/use-cases/authenticate-user'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { FakeEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { makePrismaUsersRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-users-repository'

export function makeAuthenticateUserUseCase() {
  const prismaUsersRepository = makePrismaUsersRepository()
  const bcryptHasher = new BcryptHasher()
  const jwtEncrypter = new FakeEncrypter()

  const authenticateUserUseCase = new AuthenticateUserUseCase(
    prismaUsersRepository,
    bcryptHasher,
    jwtEncrypter
  )

  return authenticateUserUseCase
}
