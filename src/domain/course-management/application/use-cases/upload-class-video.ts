import { right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type UseCase } from '@/core/use-cases/use-case'
import { ClassVideo } from '../../enterprise/entities/class-video'
import { type ClassVideosRepository } from '../repositories/class-videos-repository'
import { type TagAlreadyExistsError } from './errors/tag-already-exists-error'

interface UploadVideoClassUseCaseRequest {
  videoName: string
  videoType: string
  body: Buffer
  duration: number
  classId: string
}

type UploadVideoClassUseCaseResponse = Either<
TagAlreadyExistsError,
{
  classVideo: ClassVideo
}
>

export class UploadVideoClassUseCase implements UseCase<UploadVideoClassUseCaseRequest, UploadVideoClassUseCaseResponse> {
  constructor(private readonly classVideosRepository: ClassVideosRepository) {}

  async exec({
    videoName,
    videoType,
    body,
    duration,
    classId
  }: UploadVideoClassUseCaseRequest): Promise<UploadVideoClassUseCaseResponse> {
    // Study domain events and research the best way to do this

    const classVideo = ClassVideo.create({
      videoName,
      videoType,
      body,
      duration,
      classId: new UniqueEntityID(classId)
    })

    return right({
      classVideo
    })
  }
}
