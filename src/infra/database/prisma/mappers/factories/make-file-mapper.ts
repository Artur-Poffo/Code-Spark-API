import { FileMapper } from '../file-mapper'
import { PrismaVideosRepository } from './../../repositories/prisma-videos-repository'
import { type VideoMapper } from './../video-mapper'

export function makeFileMapper(videoMapper: VideoMapper) {
  const prismaVideosRepository = new PrismaVideosRepository(
    videoMapper
  )

  const fileMapper = new FileMapper(
    prismaVideosRepository
  )

  return fileMapper
}
