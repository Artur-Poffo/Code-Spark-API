import { PrismaFilesRepository } from '../../repositories/prisma-files-repository'
import { type FileMapper } from '../file-mapper'
import { VideoMapper } from './../video-mapper'

export function makeVideoMapper(fileMapper: FileMapper) {
  const prismaFilesRepository = new PrismaFilesRepository(
    fileMapper
  )

  const videoMapper = new VideoMapper(
    prismaFilesRepository
  )

  return videoMapper
}
