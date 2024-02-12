import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Video } from '../../enterprise/entities/video'
import { type ModulesRepository } from '../repositories/modules-repository'
import { type VideosRepository } from '../repositories/videos-repository'
import { type CoursesRepository } from './../repositories/courses-repository'

interface GetCourseStatsUseCaseRequest {
  courseId: string
}

type GetCourseStatsUseCaseResponse = Either<
ResourceNotFoundError,
{
  duration: number
  numberOfClasses: number
}
>

export class GetCourseStatsUseCase implements UseCase< GetCourseStatsUseCaseRequest, GetCourseStatsUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly videosRepository: VideosRepository,
    private readonly modulesRepository: ModulesRepository
  ) { }

  async exec({
    courseId
  }: GetCourseStatsUseCaseRequest): Promise<GetCourseStatsUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const courseClasses = await this.modulesRepository.findManyClassesByCourseId(courseId)

    const courseClassesVideos: Video[] = []

    await Promise.all(
      courseClasses.map(async courseClass => {
        const videoClass = await this.videosRepository.findById(courseClass.videoId.toString())

        if (videoClass) {
          courseClassesVideos.push(videoClass)
        }
      })
    )

    let courseDuration = 0

    courseClassesVideos.forEach(video => {
      courseDuration += video.duration
    })

    return right({
      duration: courseDuration,
      numberOfClasses: courseClasses.length
    })
  }
}
