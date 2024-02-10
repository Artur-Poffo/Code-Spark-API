import { right, type Either } from '@/core/either'
import { type NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { type ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type TagsRepository } from '../repositories/tags-repository'

interface QueryCoursesByTagsUseCaseRequest {
  query: string
}

type QueryCoursesByTagsUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  courses: Course[]
}
>

export class QueryCoursesByTagsUseCase implements UseCase<QueryCoursesByTagsUseCaseRequest, QueryCoursesByTagsUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly tagsRepository: TagsRepository
  ) { }

  async exec({
    query
  }: QueryCoursesByTagsUseCaseRequest): Promise<QueryCoursesByTagsUseCaseResponse> {
    const tags = await this.tagsRepository.queryByValue(query)

    const coursesWithThisTags = await this.coursesRepository.queryByTags(tags)

    return right({
      courses: coursesWithThisTags
    })
  }
}
