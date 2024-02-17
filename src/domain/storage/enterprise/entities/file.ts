import { AggregateRoot } from '@/core/entities/aggregate-root'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface FileProps {
  fileName: string
  fileType: string
  body: Buffer
  fileKey: string
  size: number
  storedAt: Date
}

export class File extends AggregateRoot<FileProps> {
  get fileName() {
    return this.props.fileName
  }

  get fileType() {
    return this.props.fileType
  }

  get body() {
    return this.props.body
  }

  get fileKey() {
    return this.props.fileKey
  }

  get size() {
    return this.props.size
  }

  get storedAt() {
    return this.props.storedAt
  }

  static create(
    props: FileProps,
    id?: UniqueEntityID
  ) {
    const file = new File(
      {
        ...props
      },
      id
    )

    return file
  }
}
