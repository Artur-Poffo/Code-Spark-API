import { GetUserInfoUseCase } from '@/domain/course-management/application/use-cases/get-user-info'
import { makePrismaUsersRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-users-repository'

export function makeGetUserInfoUseCase() {
  const prismaUsersRepository = makePrismaUsersRepository()

  const getUserInfoUseCase = new GetUserInfoUseCase(
    prismaUsersRepository
  )

  return getUserInfoUseCase
}
