import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { File } from '@/domain/storage/enterprise/entities/file'
import { type Prisma, type File as PrismaFile } from '@prisma/client'
import { type VideosRepository } from './../../../../domain/course-management/application/repositories/videos-repository'

export class FileMapper {
  constructor(
    private readonly videosRepository: VideosRepository
  ) {}

  async toDomain(raw: PrismaFile): Promise<File | null> {
    const video = await this.videosRepository.findByVideoKey(raw.key)

    if (!video) {
      return null
    }

    return File.create(
      {
        fileName: raw.name,
        fileKey: raw.key,
        body: video.body,
        fileType: raw.type,
        size: Number(raw.size),
        storedAt: raw.storedAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(file: File): Promise<Prisma.FileUncheckedCreateInput> {
    const video = await this.videosRepository.findByVideoKey(file.fileKey)

    return {
      id: file.id.toString(),
      name: file.fileName,
      key: file.fileKey,
      type: file.fileType,
      size: file.size,
      storedAt: file.storedAt,
      video: video
        ? {
            connect: {
              id: video.id.toString()
            }
          }
        : undefined
    }
  }
}
