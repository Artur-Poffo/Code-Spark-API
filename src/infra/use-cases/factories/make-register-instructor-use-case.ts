import { RegisterInstructorUseCase } from '@/domain/course-management/application/use-cases/register-instructor'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { makePrismaInstructorsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-instructors-repository'

export function makeRegisterInstructorUseCase() {
  const prismaInstructorsRepository = makePrismaInstructorsRepository()
  const bcryptHasher = new BcryptHasher()

  const registerInstructorUseCase = new RegisterInstructorUseCase(
    prismaInstructorsRepository,
    bcryptHasher
  )

  return registerInstructorUseCase
}
