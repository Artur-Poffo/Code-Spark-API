import { makeClassMapper } from '../../mappers/factories/make-class-mapper'
import { PrismaClassesRepository } from './../prisma-classes-repository'

export function makePrismaClassesRepository() {
  const classMapper = makeClassMapper()
  const prismaClassesRepository = new PrismaClassesRepository(classMapper)

  return prismaClassesRepository
}
