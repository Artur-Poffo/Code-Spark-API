import { makeTag } from '../../../../../test/factories/make-tag'
import { InMemoryTagsRepository } from './../../../../../test/repositories/in-memory-tags-repository'
import { FetchRecentTagsUseCase } from './fetch-recent-tags'

let inMemoryTagsRepository: InMemoryTagsRepository
let sut: FetchRecentTagsUseCase

describe('Fetch recent tags use case', () => {
  beforeEach(() => {
    inMemoryTagsRepository = new InMemoryTagsRepository()
    sut = new FetchRecentTagsUseCase(inMemoryTagsRepository)
  })

  it('should be able to fetch recent tags correctly', async () => {
    const firstTag = makeTag({ value: 'TYPESCRIPT', addedAt: new Date('2020-01-01') })
    const secondTag = makeTag({ value: 'VUEJS', addedAt: new Date('2020-01-04') })

    await Promise.all([
      inMemoryTagsRepository.create(firstTag),
      inMemoryTagsRepository.create(secondTag)
    ])

    const result = await sut.exec()

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      tags: [
        expect.objectContaining({
          value: 'VUEJS'
        }),
        expect.objectContaining({
          value: 'TYPESCRIPT'
        })
      ]
    })
  })
})
