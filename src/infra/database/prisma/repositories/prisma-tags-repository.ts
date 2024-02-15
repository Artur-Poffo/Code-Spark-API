import { type Tag } from '@/domain/course-management/enterprise/entities/tag'
import { prisma } from '..'
import { TagMapper } from '../mappers/tag-mapper'
import { type TagsRepository } from './../../../../domain/course-management/application/repositories/tags-repository'

export class PrismaTagsRepository implements TagsRepository {
  async findById(id: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: {
        id
      }
    })

    if (!tag) {
      return null
    }

    const domainTag = TagMapper.toDomain(tag)

    return domainTag
  }

  async findAll(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany()

    return tags.map(tag => TagMapper.toDomain(tag))
  }

  async findByValue(value: string): Promise<Tag | null> {
    const tag = await prisma.tag.findFirst({
      where: {
        value
      }
    })

    if (!tag) {
      return null
    }

    const domainTag = TagMapper.toDomain(tag)

    return domainTag
  }

  async queryByValue(value: string): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      where: {
        value: {
          contains: value
        }
      }
    })

    return tags.map(tag => TagMapper.toDomain(tag))
  }

  async create(tag: Tag): Promise<Tag> {
    const infraTag = TagMapper.toPrisma(tag)

    await prisma.tag.create({
      data: infraTag
    })

    return tag
  }
}
