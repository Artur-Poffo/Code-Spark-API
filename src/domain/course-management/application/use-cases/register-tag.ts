import { left, right, type Either } from '@/core/either'
import { type UseCase } from '@/core/use-cases/use-case'
import { Tag } from '../../enterprise/entities/tag'
import { type TagsRepository } from '../repositories/tags-repository'
import { RepeatedTagError } from './errors/repeated-tag-error'
import { TagAlreadyExistsError } from './errors/tag-already-exists-error'

interface RegisterTagUseCaseRequest {
  tags: string | string[]
}

type RegisterTagUseCaseResponse = Either<
TagAlreadyExistsError,
{
  tags: Tag[]
}
>

export class RegisterTagUseCase implements UseCase<RegisterTagUseCaseRequest, RegisterTagUseCaseResponse> {
  constructor(
    private readonly tagsRepository: TagsRepository
  ) { }

  async exec({
    tags
  }: RegisterTagUseCaseRequest): Promise<RegisterTagUseCaseResponse> {
    const tagsToRegister = Array.isArray(tags) ? tags : [tags]

    const haveRepeatedTags = new Set(tagsToRegister).size !== tagsToRegister.length

    if (haveRepeatedTags) {
      return left(new RepeatedTagError())
    }

    const existingTags = await Promise.all(
      tagsToRegister.map(async (tagValue) => ({
        tagValue: tagValue.toUpperCase(),
        exists: !!(await this.tagsRepository.findByValue(tagValue.toUpperCase()))
      }))
    )

    const alreadyExists = existingTags.find((tag) => tag.exists)

    if (alreadyExists) {
      return left(new TagAlreadyExistsError(alreadyExists.tagValue))
    }

    const newTags = tagsToRegister.map((value) => Tag.create({ value: value.toUpperCase() }))

    await Promise.all(newTags.map(async (tag) => await this.tagsRepository.create(tag)))

    return right({
      tags: newTags
    })
  }
}
