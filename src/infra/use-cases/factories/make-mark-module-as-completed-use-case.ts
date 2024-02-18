import { MarkModuleAsCompletedUseCase } from '@/domain/course-management/application/use-cases/mark-module-as-completed'
import { makePrismaClassesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-classes-repository'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'
import { PrismaEnrollmentCompleteItemsRepository } from '@/infra/database/prisma/repositories/prisma-enrollment-completed-items-repository'

export function makeMarkModuleAsCompletedUseCase() {
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaClassesRepository = makePrismaClassesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()
  const prismaStudentsRepository = makePrismaStudentsRepository()
  const prismaEnrollmentCompletedItemsRepository = new PrismaEnrollmentCompleteItemsRepository()

  const markModuleAsCompletedUseCase = new MarkModuleAsCompletedUseCase(
    prismaEnrollmentsRepository,
    prismaModulesRepository,
    prismaClassesRepository,
    prismaStudentsRepository,
    prismaEnrollmentCompletedItemsRepository
  )

  return markModuleAsCompletedUseCase
}
