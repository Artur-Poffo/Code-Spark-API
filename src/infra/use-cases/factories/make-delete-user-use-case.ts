import { DeleteUserUseCase } from '@/domain/course-management/application/use-cases/delete-user'
import { makePrismaUsersRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-users-repository'

export function makeDeleteUserUseCase() {
  const prismaUsersRepository = makePrismaUsersRepository()

  const deleteUserUseCase = new DeleteUserUseCase(
    prismaUsersRepository
  )

  return deleteUserUseCase
}
