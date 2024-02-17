import { ClassMapper } from '../class-mapper'
import { PrismaEvaluationsRepository } from './../../repositories/prisma-evaluations-repository'

export function makeClassMapper() {
  const prismaEvaluationsRepository = new PrismaEvaluationsRepository()

  const classMapper = new ClassMapper(
    prismaEvaluationsRepository
  )

  return classMapper
}
