import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image, type ImageProps } from '@/domain/course-management/enterprise/entities/image'
import { faker } from '@faker-js/faker'

export function makeImage(
  override: Partial<ImageProps> = {},
  id?: UniqueEntityID
) {
  const image = Image.create(
    {
      imageName: faker.company.name(),
      imageType: 'image/jpeg',
      body: Buffer.from(faker.lorem.slug()),
      imageKey: override.imageKey ?? '12345-image.png',
      size: faker.number.int(),
      ...override
    },
    id
  )

  return image
}
