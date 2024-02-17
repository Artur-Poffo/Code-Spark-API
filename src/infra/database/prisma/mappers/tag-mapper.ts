import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type CourseTagsRepository } from '@/domain/course-management/application/repositories/course-tags-repository'
import { Tag } from '@/domain/course-management/enterprise/entities/tag'
import { type Prisma, type Tag as PrismaTag } from '@prisma/client'

export class TagMapper {
  constructor(
    private readonly courseTagsRepository: CourseTagsRepository
  ) {}

  static toDomain(raw: PrismaTag): Tag {
    return Tag.create(
      {
        value: raw.value,
        addedAt: raw.addedAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(tag: Tag): Promise<Prisma.TagUncheckedCreateInput> {
    const courseTags = await this.courseTagsRepository.findManyByTagId(tag.id.toString())

    return {
      id: tag.id.toString(),
      value: tag.value,
      addedAt: tag.addedAt,
      courseTags: {
        connect: courseTags.map(courseTag => ({ id: courseTag.id.toString() }))
      }
    }
  }
}
