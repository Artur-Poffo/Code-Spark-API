import { DeleteCourseUseCase } from '@/domain/course-management/application/use-cases/delete-course'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeDeleteCourseUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const deleteCourseUseCase = new DeleteCourseUseCase(
    prismaCoursesRepository
  )

  return deleteCourseUseCase
}
