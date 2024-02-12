import { type Tag } from '../../enterprise/entities/tag'

export interface TagsRepository {
  findById: (id: string) => Promise<Tag | null>
  findAll: () => Promise<Tag[]>
  findByValue: (value: string) => Promise<Tag | null>
  queryByValue: (value: string) => Promise<Tag[]>
  create: (tag: Tag) => Promise<Tag>
}
