import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Tag } from '../../enterprise/entities/tag'
import { type CourseTagsRepository } from '../repositories/course-tags-repository'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type InstructorsRepository } from '../repositories/instructors-repository'
import { type TagsRepository } from '../repositories/tags-repository'

interface RemoveTagFromCourseUseCaseRequest {
  tagId: string
  courseId: string
  instructorId: string
}

type RemoveTagFromCourseUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  tag: Tag
}
>

export class RemoveTagFromCourseUseCase implements UseCase<RemoveTagFromCourseUseCaseRequest, RemoveTagFromCourseUseCaseResponse> {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly instructorsRepository: InstructorsRepository,
    private readonly courseTagsRepository: CourseTagsRepository
  ) { }

  async exec({
    tagId,
    courseId,
    instructorId
  }: RemoveTagFromCourseUseCaseRequest): Promise<RemoveTagFromCourseUseCaseResponse> {
    const [tag, course, instructor] = await Promise.all([
      this.tagsRepository.findById(tagId),
      this.coursesRepository.findById(courseId),
      this.instructorsRepository.findById(instructorId)
    ])

    if (!tag || !course || !instructor) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheOwner = course.instructorId.toString() === instructorId

    if (!instructorIsTheOwner) {
      return left(new NotAllowedError())
    }

    const courseTagToRemove = await this.courseTagsRepository.findByCourseIdAndTagId(
      courseId,
      tagId
    )

    if (!courseTagToRemove) {
      return left(new ResourceNotFoundError())
    }

    await this.courseTagsRepository.delete(courseTagToRemove)

    return right({
      tag
    })
  }
}
