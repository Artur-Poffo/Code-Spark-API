import { PrismaClassesRepository } from '../../repositories/prisma-classes-repository'
import { ModuleMapper } from './../module-mapper'
import { makeClassMapper } from './make-class-mapper'

export function makeModuleMapper() {
  const classMapper = makeClassMapper()

  const prismaClassesRepository = new PrismaClassesRepository(
    classMapper
  )

  const moduleMapper = new ModuleMapper(
    prismaClassesRepository
  )

  return moduleMapper
}
