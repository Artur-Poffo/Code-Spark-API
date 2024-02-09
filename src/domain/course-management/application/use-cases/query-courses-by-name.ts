import { right, type Either } from '@/core/either'
import { type NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { type ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'

interface QueryCoursesByNameUseCaseRequest {
  query: string
}

type QueryCoursesByNameUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  courses: Course[]
}
>

export class QueryCoursesByNameUseCase implements UseCase<QueryCoursesByNameUseCaseRequest, QueryCoursesByNameUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    query
  }: QueryCoursesByNameUseCaseRequest): Promise<QueryCoursesByNameUseCaseResponse> {
    const courses = await this.coursesRepository.queryByName(query)

    return right({
      courses
    })
  }
}
