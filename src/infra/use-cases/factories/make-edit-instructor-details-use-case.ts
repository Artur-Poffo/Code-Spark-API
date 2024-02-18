import { EditInstructorDetailsUseCase } from '@/domain/course-management/application/use-cases/edit-instructor-details'
import { makePrismaInstructorsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-instructors-repository'

export function makeEditInstructorDetailsUseCase() {
  const prismaInstructorsRepository = makePrismaInstructorsRepository()

  const editInstructorDetailsUseCase = new EditInstructorDetailsUseCase(
    prismaInstructorsRepository
  )

  return editInstructorDetailsUseCase
}
