import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { File, type FileProps } from '@/domain/storage/enterprise/entities/file'
import { faker } from '@faker-js/faker'

export function makeFile(
  override: Partial<FileProps> = {},
  id?: UniqueEntityID
) {
  const file = File.create(
    {
      fileName: faker.company.name(),
      fileType: 'file/mp4',
      body: Buffer.from(faker.lorem.slug()),
      size: faker.number.int(),
      fileKey: override.fileKey ?? 'file-key',
      storedAt: override.storedAt ?? new Date(),
      ...override
    },
    id
  )

  return file
}
