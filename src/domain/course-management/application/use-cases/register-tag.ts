import { left, right, type Either } from '@/core/either'
import { type UseCase } from '@/core/use-cases/use-case'
import { Tag } from '../../enterprise/entities/tag'
import { type TagsRepository } from '../repositories/tags-repository'
import { TagAlreadyExistsError } from './errors/tag-already-exists-error'

interface RegisterTagUseCaseRequest {
  value: string
}

type RegisterTagUseCaseResponse = Either<
TagAlreadyExistsError,
{
  tag: Tag
}
>

export class RegisterTagUseCase implements UseCase<RegisterTagUseCaseRequest, RegisterTagUseCaseResponse> {
  constructor(
    private readonly tagsRepository: TagsRepository
  ) { }

  async exec({
    value
  }: RegisterTagUseCaseRequest): Promise<RegisterTagUseCaseResponse> {
    const tagAlreadyExists = await this.tagsRepository.findByValue(value)

    if (tagAlreadyExists) {
      return left(new TagAlreadyExistsError(value))
    }

    const tag = Tag.create({
      value
    })

    await this.tagsRepository.create(tag)

    return right({
      tag
    })
  }
}
