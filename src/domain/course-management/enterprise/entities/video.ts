import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface VideoProps {
  videoName: string
  videoType: 'video/mp4' | 'video/avi'
  body: Buffer
  duration: number
  size: number
  storedAt: Date
}

export class Video extends Entity<VideoProps> {
  get videoName() {
    return this.props.videoName
  }

  get videoType() {
    return this.props.videoType
  }

  get body() {
    return this.props.body
  }

  get duration() {
    return this.props.duration
  }

  static create(
    props: Optional<VideoProps, 'storedAt' | 'videoType'>,
    id?: UniqueEntityID
  ) {
    const video = new Video(
      {
        videoType: props.videoType ?? 'video/mp4',
        storedAt: props.storedAt ?? new Date(),
        ...props
      },
      id
    )

    return video
  }
}
