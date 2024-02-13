import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Tag } from '../../enterprise/entities/tag'
import { type CourseTagsRepository } from './../repositories/course-tags-repository'
import { type CoursesRepository } from './../repositories/courses-repository'
import { type TagsRepository } from './../repositories/tags-repository'

interface FetchCourseTagsUseCaseRequest {
  courseId: string
}

type FetchCourseTagsUseCaseResponse = Either<
ResourceNotFoundError,
{
  tags: Tag[]
}
>

export class FetchCourseTagsUseCase implements UseCase<FetchCourseTagsUseCaseRequest, FetchCourseTagsUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly courseTagsRepository: CourseTagsRepository,
    private readonly tagsRepository: TagsRepository
  ) { }

  async exec({
    courseId
  }: FetchCourseTagsUseCaseRequest): Promise<FetchCourseTagsUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const courseTags = await this.courseTagsRepository.findManyByCourseId(courseId)

    const tags: Tag[] = []

    await Promise.all(courseTags.map(async courseTag => {
      const tag = await this.tagsRepository.findById(courseTag.tagId.toString())

      if (tag) {
        tags.push(tag)
      }
    }))

    return right({
      tags
    })
  }
}
