import { type File } from '../../enterprise/entities/file'

export interface FilesRepository {
  findById: (id: string) => Promise<File | null>
  findByKey: (key: string) => Promise<File | null>
  create: (file: File) => Promise<File>
}
