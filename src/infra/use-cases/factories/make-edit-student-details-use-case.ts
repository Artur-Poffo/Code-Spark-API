import { EditStudentDetailsUseCase } from '@/domain/course-management/application/use-cases/edit-student-details'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'

export function makeEditStudentDetailsUseCase() {
  const prismaStudentsRepository = makePrismaStudentsRepository()

  const editStudentDetailsUseCase = new EditStudentDetailsUseCase(
    prismaStudentsRepository
  )

  return editStudentDetailsUseCase
}
