import { left, right, type Either } from '@/core/either'
import { InvalidMimeTypeError } from '@/core/errors/errors/invalid-mime-type-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { File } from '../../enterprise/entities/file'
import { type FilesRepository } from '../repositories/files-repository'
import { type Uploader } from '../upload/uploader'

interface UploadFileUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
  size: number
  storedAt: Date
}

type UploadFileUseCaseResponse = Either<
InvalidMimeTypeError,
{
  file: File
}
>

export class UploadFileUseCase implements UseCase<UploadFileUseCaseRequest, UploadFileUseCaseResponse> {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly uploader: Uploader
  ) { }

  async exec({
    fileName,
    fileType,
    body,
    size,
    storedAt
  }: UploadFileUseCaseRequest): Promise<UploadFileUseCaseResponse> {
    if (!/image\/(jpeg|png)|video\/(mp4|avi)/.test(fileType)) {
      return left(new InvalidMimeTypeError(fileType))
    }

    const { key } = await this.uploader.upload({ fileName, fileType, body, size, storedAt })

    const file = File.create({
      fileName,
      fileType,
      body,
      fileKey: key,
      size,
      storedAt
    })

    await this.filesRepository.create(file)

    return right({
      file
    })
  }
}
