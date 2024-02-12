import { right, type Either } from '@/core/either'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Tag } from '../../enterprise/entities/tag'
import { type TagsRepository } from './../repositories/tags-repository'

type FetchRecentTagsUseCaseResponse = Either<
null,
{
  tags: Tag[]
}
>

export class FetchRecentTagsUseCase implements UseCase<null, FetchRecentTagsUseCaseResponse> {
  constructor(
    private readonly tagsRepository: TagsRepository
  ) { }

  async exec(): Promise<FetchRecentTagsUseCaseResponse> {
    const tags = await this.tagsRepository.findAll()

    return right({
      tags
    })
  }
}
