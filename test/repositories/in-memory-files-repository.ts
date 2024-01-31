import { type FilesRepository } from '@/domain/storage/application/repositories/files-repository'
import { type File } from '@/domain/storage/enterprise/entities/file'

export class InMemoryFilesRepository implements FilesRepository {
  public items: File[] = []

  async findById(id: string): Promise<File | null> {
    const file = this.items.find(fileToCompare => fileToCompare.id.toString() === id)

    if (!file) {
      return null
    }

    return file
  }

  async create(file: File): Promise<File> {
    this.items.push(file)
    return file
  }
}
