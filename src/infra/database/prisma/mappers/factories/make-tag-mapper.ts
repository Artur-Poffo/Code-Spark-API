import { PrismaCourseTagsRepository } from '../../repositories/prisma-course-tags-repository'
import { TagMapper } from '../tag-mapper'

export function makeTagMapper() {
  const prismaCourseTagRepository = new PrismaCourseTagsRepository()

  const tagMapper = new TagMapper(
    prismaCourseTagRepository
  )

  return tagMapper
}
