import { RegisterCourseUseCase } from '@/domain/course-management/application/use-cases/register-course'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeRegisterCourseUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const registerCourseUseCase = new RegisterCourseUseCase(
    prismaCoursesRepository
  )

  return registerCourseUseCase
}
