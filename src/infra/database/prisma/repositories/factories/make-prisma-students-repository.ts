import { makeStudentMapper } from '../../mappers/factories/make-student-mapper'
import { PrismaStudentsRepository } from './../prisma-students-repository'

export function makePrismaStudentsRepository() {
  const studentMapper = makeStudentMapper()
  const prismaStudentsRepository = new PrismaStudentsRepository(studentMapper)

  return prismaStudentsRepository
}
