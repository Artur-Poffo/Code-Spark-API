import { right, type Either } from '@/core/either'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type TagsRepository } from '../repositories/tags-repository'

interface QueryCoursesByTagsUseCaseRequest {
  query: string
}

type QueryCoursesByTagsUseCaseResponse = Either<
null,
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
