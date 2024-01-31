import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ClassVideo, type ClassVideoProps } from '@/domain/course-management/enterprise/entities/class-video'
import { faker } from '@faker-js/faker'

export function makeClassVideo(
  override: Partial<ClassVideoProps> = {},
  id?: UniqueEntityID
) {
  const classVideo = ClassVideo.create(
    {
      videoName: faker.company.name(),
      videoType: 'video/mp4',
      body: Buffer.from(faker.lorem.slug()),
      classId: override.classId ?? new UniqueEntityID(),
      duration: faker.number.float(),
      ...override
    },
    id
  )

  return classVideo
}
