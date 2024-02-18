import { makeFileMapper } from '../../mappers/factories/make-file-mapper'
import { PrismaFilesRepository } from './../prisma-files-repository'

export function makePrismaFilesRepository() {
  const fileMapper = makeFileMapper()
  const prismaFilesRepository = new PrismaFilesRepository(fileMapper)

  return prismaFilesRepository
}
