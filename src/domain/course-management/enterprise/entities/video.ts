import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface VideoProps {
  videoName: string
  videoType: 'video/mp4' | 'video/avi'
  body: Buffer
  duration: number
  size: number
  videoKey: string
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

  get size() {
    return this.props.size
  }

  get videoKey() {
    return this.props.videoKey
  }

  set videoKey(videoKeyToAppend) {
    this.props.videoKey = videoKeyToAppend
  }

  get storedAt() {
    return this.props.storedAt
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
