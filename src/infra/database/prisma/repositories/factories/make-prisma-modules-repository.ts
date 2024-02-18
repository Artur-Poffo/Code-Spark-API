import { makeModuleMapper } from '../../mappers/factories/make-module-mapper'
import { PrismaModulesRepository } from './../prisma-modules-repository'

export function makePrismaModulesRepository() {
  const moduleMapper = makeModuleMapper()
  const prismaModulesRepository = new PrismaModulesRepository(moduleMapper)

  return prismaModulesRepository
}
