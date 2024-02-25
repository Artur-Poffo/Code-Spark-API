import { GetClassDetailsUseCase } from '@/domain/course-management/application/use-cases/get-class-details'
import { makePrismaClassesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-classes-repository'

export function makeGetClassDetailsUseCase() {
  const prismaClassesRepository = makePrismaClassesRepository()

  const getClassDetailsUseCase = new GetClassDetailsUseCase(
    prismaClassesRepository
  )

  return getClassDetailsUseCase
}
