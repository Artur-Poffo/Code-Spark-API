import { makeInstructorMapper } from '../../mappers/factories/make-instructor-mapper'
import { PrismaInstructorsRepository } from './../prisma-instructors-repository'

export function makePrismaInstructorsRepository() {
  const instructorMapper = makeInstructorMapper()
  const prismaInstructorsRepository = new PrismaInstructorsRepository(instructorMapper)

  return prismaInstructorsRepository
}
