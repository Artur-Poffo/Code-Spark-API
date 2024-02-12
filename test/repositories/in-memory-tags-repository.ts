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

  async findAll(): Promise<Tag[]> {
    const tags = [...this.items]

    return tags.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
  }

  async queryByValue(value: string): Promise<Tag[]> {
    return this.items.filter(tagToCompare => tagToCompare.value.toUpperCase().includes(value.toUpperCase()))
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
