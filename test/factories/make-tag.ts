import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Tag, type TagProps } from '@/domain/course-management/enterprise/entities/tag'
import { faker } from '@faker-js/faker'

export function makeTag(
  override: Partial<TagProps> = {},
  id?: UniqueEntityID
) {
  const tag = Tag.create(
    {
      value: faker.lorem.word(),
      ...override
    },
    id
  )

  return tag
}
