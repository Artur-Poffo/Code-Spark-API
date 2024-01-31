import { left, right, type Either } from '@/core/either'
import { type UseCase } from '@/core/use-cases/use-case'
import { File } from '../../enterprise/entities/file'
import { type FilesRepository } from '../repositories/files-repository'
import { type Uploader } from '../upload/uploader'
import { InvalidMimeTypeError } from './errors/invalid-mime-type-error'

interface UploadFileUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
  size: number
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
    size
  }: UploadFileUseCaseRequest): Promise<UploadFileUseCaseResponse> {
    if (!/image\/(jpeg|png)|video\/(mp4|avi)/.test(fileType)) {
      return left(new InvalidMimeTypeError(fileType))
    }

    const { key } = await this.uploader.upload({ fileName, fileType, body, size })

    const file = File.create({
      fileName,
      fileType,
      fileKey: key,
      size
    })

    await this.filesRepository.create(file)

    return right({
      file
    })
  }
}
