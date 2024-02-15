import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Tag } from '@/domain/course-management/enterprise/entities/tag'
import { type Prisma, type Tag as PrismaTag } from '@prisma/client'

export class TagMapper {
  static toDomain(raw: PrismaTag): Tag {
    return Tag.create(
      {
        value: raw.value
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(tag: Tag): Prisma.TagUncheckedCreateInput {
    return {
      id: tag.id.toString(),
      value: tag.value,
      addedAt: tag.addedAt
    }
  }
}
