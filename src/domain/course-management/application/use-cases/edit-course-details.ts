import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Course } from '../../enterprise/entities/course'
import { type CoursesRepository } from '../repositories/courses-repository'

interface EditCourseDetailsUseCaseRequest {
  name?: string
  description?: string
  coverImageKey?: string | null
  bannerImageKey?: string | null
  courseId: string
}

type EditCourseDetailsUseCaseResponse = Either<
ResourceNotFoundError,
{
  course: Course
}
>

export class EditCourseDetailsUseCase implements UseCase<EditCourseDetailsUseCaseRequest, EditCourseDetailsUseCaseResponse> {
  constructor(
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    name,
    description,
    coverImageKey,
    bannerImageKey,
    courseId
  }: EditCourseDetailsUseCaseRequest): Promise<EditCourseDetailsUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    course.name = name ?? course.name
    course.description = description ?? course.description
    course.coverImageKey = coverImageKey ?? course.coverImageKey
    course.bannerImageKey = bannerImageKey ?? course.bannerImageKey

    return right({
      course
    })
  }
}
