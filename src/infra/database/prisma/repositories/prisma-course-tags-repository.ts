import { type CourseTagsRepository } from '@/domain/course-management/application/repositories/course-tags-repository'
import { type CourseTag } from '@/domain/course-management/enterprise/entities/course-tag'
import { prisma } from '..'
import { CourseTagMapper } from '../mappers/course-tag-mapper'

export class PrismaCourseTagsRepository implements CourseTagsRepository {
  async findById(id: string): Promise<CourseTag | null> {
    const courseTag = await prisma.courseTag.findUnique({
      where: {
        id
      }
    })

    if (!courseTag) {
      return null
    }

    const domainCourseTag = CourseTagMapper.toDomain(courseTag)

    return domainCourseTag
  }

  async findByCourseIdAndTagId(courseId: string, tagId: string): Promise<CourseTag | null> {
    const courseTag = await prisma.courseTag.findFirst({
      where: {
        courseId,
        tagId
      }
    })

    if (!courseTag) {
      return null
    }

    const domainCourseTag = CourseTagMapper.toDomain(courseTag)

    return domainCourseTag
  }

  async findManyByCourseId(courseId: string): Promise<CourseTag[]> {
    const courseTags = await prisma.courseTag.findMany({
      where: {
        courseId
      },
      orderBy: {
        attachedAt: 'desc'
      }
    })

    return courseTags.map(courseTag => CourseTagMapper.toDomain(courseTag))
  }

  async findManyByTagId(tagId: string): Promise<CourseTag[]> {
    const courseTags = await prisma.courseTag.findMany({
      where: {
        tagId
      },
      orderBy: {
        attachedAt: 'desc'
      }
    })

    return courseTags.map(courseTag => CourseTagMapper.toDomain(courseTag))
  }

  async findAll(): Promise<CourseTag[]> {
    const courseTags = await prisma.courseTag.findMany()
    return courseTags.map(courseTag => CourseTagMapper.toDomain(courseTag))
  }

  async create(courseTag: CourseTag): Promise<CourseTag> {
    const infraCourseTag = CourseTagMapper.toPrisma(courseTag)

    await prisma.courseTag.create({
      data: infraCourseTag
    })

    return courseTag
  }

  async delete(courseTag: CourseTag): Promise<void> {
    await prisma.courseTag.delete({
      where: {
        id: courseTag.id.toString()
      }
    })
  }
}
