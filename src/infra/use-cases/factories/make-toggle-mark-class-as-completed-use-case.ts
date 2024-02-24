import { ToggleMarkClassAsCompletedUseCase } from '@/domain/course-management/application/use-cases/toggle-mark-class-as-completed'
import { makePrismaClassesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-classes-repository'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'
import { PrismaEnrollmentCompleteItemsRepository } from '@/infra/database/prisma/repositories/prisma-enrollment-completed-items-repository'

export function makeToggleMarkClassAsCompletedUseCase() {
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaClassesRepository = makePrismaClassesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()
  const prismaStudentsRepository = makePrismaStudentsRepository()
  const prismaEnrollmentCompletedItemsRepository = new PrismaEnrollmentCompleteItemsRepository()

  const toggleMarkClassAsCompletedUseCase = new ToggleMarkClassAsCompletedUseCase(
    prismaEnrollmentsRepository,
    prismaCoursesRepository,
    prismaModulesRepository,
    prismaClassesRepository,
    prismaStudentsRepository,
    prismaEnrollmentCompletedItemsRepository
  )

  return toggleMarkClassAsCompletedUseCase
}
