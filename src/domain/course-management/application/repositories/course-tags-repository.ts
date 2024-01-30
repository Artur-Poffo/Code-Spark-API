import { type CourseTag } from '../../enterprise/entities/course-tag'

export interface CourseTagsRepository {
  findById: (id: string) => Promise<CourseTag | null>
  findManyByCourseId: (courseId: string) => Promise<CourseTag[]>
  create: (courseTag: CourseTag) => Promise<CourseTag>
}
