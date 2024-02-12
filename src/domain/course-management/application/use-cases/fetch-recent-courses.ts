import { right, type Either } from '@/core/either'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'

type FetchRecentCoursesUseCaseResponse = Either<
null,
{
  courses: Course[]
}
>

export class FetchRecentCoursesUseCase implements UseCase<null, FetchRecentCoursesUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec(): Promise<FetchRecentCoursesUseCaseResponse> {
    const courses = await this.coursesRepository.findAll()

    return right({
      courses
    })
  }
}
