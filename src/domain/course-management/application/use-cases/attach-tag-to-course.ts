import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { CourseTag } from '../../enterprise/entities/course-tag'
import { type CourseTagsRepository } from '../repositories/course-tags-repository'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type TagsRepository } from '../repositories/tags-repository'
import { RepeatedTagError } from './errors/repeated-tag-error'
import { TagAlreadyAttachedError } from './errors/tag-already-attached-error'

interface AttachTagToCourseUseCaseRequest {
  tagIds: string[]
  courseId: string
  instructorId: string
}

type AttachTagToCourseUseCaseResponse = Either<
RepeatedTagError | ResourceNotFoundError | NotAllowedError | TagAlreadyAttachedError,
{
  attachedTags: CourseTag[]
}
>

export class AttachTagToCourseUseCase implements UseCase<AttachTagToCourseUseCaseRequest, AttachTagToCourseUseCaseResponse> {
  constructor(
    private readonly courseTagsRepository: CourseTagsRepository,
    private readonly tagsRepository: TagsRepository,
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    tagIds,
    courseId,
    instructorId
  }: AttachTagToCourseUseCaseRequest): Promise<AttachTagToCourseUseCaseResponse> {
    const haveRepeatedTagsToAttach = new Set(tagIds).size !== tagIds.length

    if (haveRepeatedTagsToAttach) {
      return left(new RepeatedTagError())
    }

    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheSponsor = course.instructorId.toString() === instructorId

    if (!instructorIsTheSponsor) {
      return left(new NotAllowedError())
    }

    const courseTags = await this.courseTagsRepository.findManyByCourseId(courseId)
    const anyTagIsAlreadyAttached = courseTags.find(courseTag => tagIds.includes(courseTag.tagId.toString()))

    if (anyTagIsAlreadyAttached) {
      return left(new TagAlreadyAttachedError({ tagId: anyTagIsAlreadyAttached.tagId.toString(), courseId }))
    }

    const tagsToAttach = await Promise.all(tagIds.map(async (tagId) => {
      const tagToAttach = await this.tagsRepository.findById(tagId)

      if (!tagToAttach) {
        return null
      }

      const newCourseTag = CourseTag.create({
        tagId: new UniqueEntityID(tagId),
        courseId: new UniqueEntityID(courseId)
      })

      return await this.courseTagsRepository.create(newCourseTag)
    })
    )

    const attachedTags = tagsToAttach.filter(attachedTag => attachedTag !== null) as unknown as CourseTag[]

    if (attachedTags.length === 0) {
      return right({
        attachedTags: []
      })
    }

    return right({
      attachedTags
    })
  }
}
