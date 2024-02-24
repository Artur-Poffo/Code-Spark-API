import { DomainEvents } from '@/core/events/domain-events'
import { type FilesRepository } from '@/domain/storage/application/repositories/files-repository'
import { type File } from '@/domain/storage/enterprise/entities/file'
import { prisma } from '..'
import { FileMapper } from './../mappers/file-mapper'

export class PrismaFilesRepository implements FilesRepository {
  constructor(
    private readonly fileMapper: FileMapper
  ) {}

  async findById(id: string): Promise<File | null> {
    const file = await prisma.file.findUnique({
      where: {
        id
      }
    })

    if (!file) {
      return null
    }

    const domainFile = FileMapper.toDomain(file)

    return domainFile
  }

  async findByKey(key: string): Promise<File | null> {
    const file = await prisma.file.findUnique({
      where: {
        key
      }
    })

    if (!file) {
      return null
    }

    const domainFile = FileMapper.toDomain(file)

    return domainFile
  }

  async create(file: File): Promise<File> {
    const infraFile = await this.fileMapper.toPrisma(file)

    await prisma.file.create({
      data: infraFile
    })

    DomainEvents.dispatchEventsForAggregate(file.id)

    return file
  }
}
