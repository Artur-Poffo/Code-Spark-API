import { type CourseTagsRepository } from '@/domain/course-management/application/repositories/course-tags-repository'
import { type CourseTag } from '@/domain/course-management/enterprise/entities/course-tag'

export class InMemoryCourseTagsRepository implements CourseTagsRepository {
  public items: CourseTag[] = []

  async findById(id: string): Promise<CourseTag | null> {
    const courseTag = this.items.find(courseTagToCompare => courseTagToCompare.id.toString() === id)

    if (!courseTag) {
      return null
    }

    return courseTag
  }

  async findByCourseIdAndTagId(courseId: string, tagId: string): Promise<CourseTag | null> {
    const courseTag = this.items.find(courseTagToFind => {
      if (courseTagToFind.courseId.toString() === courseId && courseTagToFind.tagId.toString() === tagId) {
        return courseTagToFind
      }

      return undefined
    })

    if (!courseTag) {
      return null
    }

    return courseTag
  }

  async findManyByTagId(tagId: string): Promise<CourseTag[]> {
    return this.items.filter(courseTagToCompare => courseTagToCompare.tagId.toString() === tagId)
  }

  async findManyByCourseId(courseId: string): Promise<CourseTag[]> {
    return this.items.filter(courseTagToCompare => courseTagToCompare.courseId.toString() === courseId)
  }

  async findAll(): Promise<CourseTag[]> {
    return this.items
  }

  async create(courseTag: CourseTag): Promise<CourseTag> {
    this.items.push(courseTag)
    return courseTag
  }

  async delete(courseTag: CourseTag): Promise<void> {
    const courseTagIndex = this.items.indexOf(courseTag)
    this.items.splice(courseTagIndex, 1)
  }
}
