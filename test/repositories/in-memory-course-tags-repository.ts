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

  async findManyByCourseId(courseId: string): Promise<CourseTag[]> {
    return this.items.filter(courseTagToCompare => courseTagToCompare.courseId.toString() === courseId)
  }

  async create(courseTag: CourseTag): Promise<CourseTag> {
    this.items.push(courseTag)
    return courseTag
  }
}