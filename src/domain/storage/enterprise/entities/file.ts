import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface FileProps {
  fileName: string
  fileType: string
  body: Buffer
  storedAt: Date
}

export class File extends Entity<FileProps> {
  get fileName() {
    return this.props.fileName
  }

  get fileType() {
    return this.props.fileType
  }

  get body() {
    return this.props.body
  }

  get storedAt() {
    return this.props.storedAt
  }

  static create(
    props: Optional<FileProps, 'storedAt'>,
    id?: UniqueEntityID
  ) {
    const file = new File(
      {
        storedAt: props.storedAt ?? new Date(),
        ...props
      },
      id
    )

    return file
  }
}
