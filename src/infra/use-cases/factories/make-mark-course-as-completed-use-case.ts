import { MarkCourseAsCompletedUseCase } from '@/domain/course-management/application/use-cases/mark-course-as-completed'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'
import { PrismaEnrollmentCompleteItemsRepository } from '@/infra/database/prisma/repositories/prisma-enrollment-completed-items-repository'

export function makeMarkCourseAsCompletedUseCase() {
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()
  const prismaStudentsRepository = makePrismaStudentsRepository()
  const prismaEnrollmentCompletedItemsRepository = new PrismaEnrollmentCompleteItemsRepository()

  const markCourseAsCompletedUseCase = new MarkCourseAsCompletedUseCase(
    prismaEnrollmentsRepository,
    prismaCoursesRepository,
    prismaModulesRepository,
    prismaStudentsRepository,
    prismaEnrollmentCompletedItemsRepository
  )

  return markCourseAsCompletedUseCase
}
