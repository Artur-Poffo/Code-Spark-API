import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Video, type VideoProps } from '@/domain/course-management/enterprise/entities/video'
import { faker } from '@faker-js/faker'

export function makeVideo(
  override: Partial<VideoProps> = {},
  id?: UniqueEntityID
) {
  const video = Video.create(
    {
      videoName: faker.company.name(),
      videoType: 'video/mp4',
      body: Buffer.from(faker.lorem.slug()),
      size: faker.number.int(),
      duration: faker.number.float(),
      ...override
    },
    id
  )

  return video
}
