import { RegisterTagUseCase } from '@/domain/course-management/application/use-cases/register-tag'
import { makePrismaTagsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-tags-repository'

export function makeRegisterTagUseCase() {
  const prismaTagsRepository = makePrismaTagsRepository()

  const registerTagUseCase = new RegisterTagUseCase(
    prismaTagsRepository
  )

  return registerTagUseCase
}
