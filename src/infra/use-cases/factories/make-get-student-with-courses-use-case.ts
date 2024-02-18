import { GetStudentWithCoursesUseCase } from '@/domain/course-management/application/use-cases/get-student-with-courses'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeGetStudentWithCoursesUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const getStudentWithCoursesUseCase = new GetStudentWithCoursesUseCase(
    prismaCoursesRepository
  )

  return getStudentWithCoursesUseCase
}
