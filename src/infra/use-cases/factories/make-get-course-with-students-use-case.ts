import { GetCourseWithStudentsUseCase } from '@/domain/course-management/application/use-cases/get-course-with-students'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeGetCourseWithStudentsUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const getCourseWithStudentsUseCase = new GetCourseWithStudentsUseCase(
    prismaCoursesRepository
  )

  return getCourseWithStudentsUseCase
}
