import { AggregateRoot } from '@/core/entities/aggregate-root'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface FileProps {
  fileName: string
  fileType: string
  fileKey: string
  storedAt: Date
}

export class File extends AggregateRoot<FileProps> {
  get fileName() {
    return this.props.fileName
  }

  get fileType() {
    return this.props.fileType
  }

  get fileKey() {
    return this.props.fileKey
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
