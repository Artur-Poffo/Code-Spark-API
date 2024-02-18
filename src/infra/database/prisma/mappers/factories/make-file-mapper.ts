import { FileMapper } from '../file-mapper'
import { PrismaVideosRepository } from './../../repositories/prisma-videos-repository'

export function makeFileMapper() {
  const prismaVideosRepository = new PrismaVideosRepository()

  const fileMapper = new FileMapper(
    prismaVideosRepository
  )

  return fileMapper
}
