import { MarkClassAsCompletedUseCase } from '@/domain/course-management/application/use-cases/mark-class-as-completed'
import { makePrismaClassesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-classes-repository'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'
import { PrismaEnrollmentCompleteItemsRepository } from '@/infra/database/prisma/repositories/prisma-enrollment-completed-items-repository'

export function makeMarkClassAsCompletedUseCase() {
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaClassesRepository = makePrismaClassesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()
  const prismaStudentsRepository = makePrismaStudentsRepository()
  const prismaEnrollmentCompletedItemsRepository = new PrismaEnrollmentCompleteItemsRepository()

  const markClassAsCompletedUseCase = new MarkClassAsCompletedUseCase(
    prismaEnrollmentsRepository,
    prismaCoursesRepository,
    prismaModulesRepository,
    prismaClassesRepository,
    prismaStudentsRepository,
    prismaEnrollmentCompletedItemsRepository
  )

  return markClassAsCompletedUseCase
}
