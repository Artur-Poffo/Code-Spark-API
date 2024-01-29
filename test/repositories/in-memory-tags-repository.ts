import { type TagsRepository } from '@/domain/course-management/application/repositories/tags-repository'
import { type Tag } from '@/domain/course-management/enterprise/entities/tag'

export class InMemoryTagsRepository implements TagsRepository {
  public items: Tag[] = []

  async findById(id: string): Promise<Tag | null> {
    const tag = this.items.find(tagToCompare => tagToCompare.id.toString() === id)

    if (!tag) {
      return null
    }

    return tag
  }

  async findByValue(value: string): Promise<Tag | null> {
    const tag = this.items.find(tagToCompare => tagToCompare.value === value)

    if (!tag) {
      return null
    }

    return tag
  }

  async create(tag: Tag): Promise<Tag> {
    this.items.push(tag)
    return tag
  }
}
