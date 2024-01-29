import { type Tag } from '../../enterprise/entities/tag'

export interface TagsRepository {
  findById: (id: string) => Promise<Tag | null>
  findByValue: (value: string) => Promise<Tag | null>
  create: (tag: Tag) => Promise<Tag>
}
