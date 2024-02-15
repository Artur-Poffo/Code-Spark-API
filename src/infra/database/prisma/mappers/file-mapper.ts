import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { File } from '@/domain/storage/enterprise/entities/file'
import { type Prisma, type File as PrismaFile } from '@prisma/client'

export class FileMapper {
  static toDomain(raw: PrismaFile): File {
    return File.create(
      {
        fileName: raw.name,
        fileKey: raw.key,
        fileType: raw.type,
        size: Number(raw.size),
        storedAt: raw.storedAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(file: File): Prisma.FileUncheckedCreateInput {
    return {
      id: file.id.toString(),
      name: file.fileName,
      key: file.fileKey,
      type: file.fileType,
      size: file.size,
      storedAt: file.storedAt
    }
  }
}
