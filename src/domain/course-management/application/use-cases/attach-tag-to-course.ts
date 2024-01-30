import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { CourseTag } from '../../enterprise/entities/course-tag'
import { type CourseTagsRepository } from '../repositories/course-tags-repository'
import { type CoursesRepository } from '../repositories/courses-repository'
import { TagAlreadyAttachedError } from './errors/tag-already-attached-error'
import { type TagAlreadyExistsError } from './errors/tag-already-exists-error'

interface AttachTagToCourseUseCaseRequest {
  courseId: string
  tagId: string
  instructorId: string
}

type AttachTagToCourseUseCaseResponse = Either<
TagAlreadyExistsError,
{
  attachedTag: CourseTag
}
>

export class AttachTagToCourseUseCase implements UseCase<AttachTagToCourseUseCaseRequest, AttachTagToCourseUseCaseResponse> {
  constructor(
    private readonly courseTagsRepository: CourseTagsRepository,
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    courseId,
    tagId,
    instructorId
  }: AttachTagToCourseUseCaseRequest): Promise<AttachTagToCourseUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheSponsor = course.instructorId.toString() === instructorId

    if (!instructorIsTheSponsor) {
      return left(new NotAllowedError())
    }

    const courseTags = await this.courseTagsRepository.findManyByCourseId(courseId)
    const tagIsAlreadyAttached = courseTags.find(courseTag => courseTag.tagId.toString() === tagId)

    if (tagIsAlreadyAttached) {
      return left(new TagAlreadyAttachedError({ tagId, courseId }))
    }

    const newAttachedTag = CourseTag.create({
      courseId: new UniqueEntityID(courseId),
      tagId: new UniqueEntityID(tagId)
    })

    await this.courseTagsRepository.create(newAttachedTag)

    return right({
      attachedTag: newAttachedTag
    })
  }
}
