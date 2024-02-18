import { RegisterStudentUseCase } from '@/domain/course-management/application/use-cases/register-student'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'

export function makeRegisterStudentUseCase() {
  const prismaStudentsRepository = makePrismaStudentsRepository()
  const bcryptHasher = new BcryptHasher()

  const registerStudentUseCase = new RegisterStudentUseCase(
    prismaStudentsRepository,
    bcryptHasher
  )

  return registerStudentUseCase
}
