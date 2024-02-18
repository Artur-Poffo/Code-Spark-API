import { type CourseTag } from '../../enterprise/entities/course-tag'

export interface CourseTagsRepository {
  findById: (id: string) => Promise<CourseTag | null>
  findByCourseIdAndTagId: (courseId: string, tagId: string) => Promise<CourseTag | null>
  findManyByCourseId: (courseId: string) => Promise<CourseTag[]>
  findManyByTagId: (tagId: string) => Promise<CourseTag[]>
  findAll: () => Promise<CourseTag[]>
  create: (courseTag: CourseTag) => Promise<CourseTag>
  delete: (courseTag: CourseTag) => Promise<void>
}
