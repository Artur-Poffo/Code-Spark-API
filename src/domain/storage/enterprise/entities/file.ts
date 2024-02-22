import { AggregateRoot } from '@/core/entities/aggregate-root'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Image } from '@/domain/course-management/enterprise/entities/image'
import { type Video } from '@/domain/course-management/enterprise/entities/video'
import { ImageKeyGeneratedEvent } from '../events/image-key-generated'
import { VideoKeyGeneratedEvent } from '../events/video-key-generated'

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

  addImageDomainEvent(file: File, image: Image) {
    file.addDomainEvent(new ImageKeyGeneratedEvent(file, image))
  }

  addVideoDomainEvent(file: File, video: Video) {
    file.addDomainEvent(new VideoKeyGeneratedEvent(file, video))
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
