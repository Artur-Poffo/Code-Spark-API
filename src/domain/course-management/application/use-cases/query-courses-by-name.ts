import { right, type Either } from '@/core/either'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'

interface QueryCoursesByNameUseCaseRequest {
  query: string
}

type QueryCoursesByNameUseCaseResponse = Either<
null,
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
