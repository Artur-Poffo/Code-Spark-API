import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { ClassVideo } from '../../enterprise/entities/class-video'
import { type ClassVideosRepository } from './../repositories/class-videos-repository'
import { type ClassesRepository } from './../repositories/classes-repository'

interface AddVideoToClassUseCaseRequest {
  videoName: string
  videoType: string
  body: Buffer
  duration: number
  classId: string
}

type AddVideoToClassUseCaseResponse = Either<
ResourceNotFoundError,
{
  classVideo: ClassVideo
}
>

export class AddVideoToClassUseCase implements UseCase<AddVideoToClassUseCaseRequest, AddVideoToClassUseCaseResponse> {
  constructor(
    private readonly classesRepository: ClassesRepository,
    private readonly classVideosRepository: ClassVideosRepository
  ) {}

  async exec({
    videoName,
    videoType,
    body,
    duration,
    classId
  }: AddVideoToClassUseCaseRequest): Promise<AddVideoToClassUseCaseResponse> {
    const classToAddVideo = await this.classesRepository.findById(classId)

    if (!classToAddVideo) {
      return left(new ResourceNotFoundError())
    }

    const classVideo = ClassVideo.create({
      videoName,
      videoType,
      body,
      duration,
      classId: new UniqueEntityID(classId)
    })

    await this.classVideosRepository.create(classVideo)

    return right({
      classVideo
    })
  }
}
