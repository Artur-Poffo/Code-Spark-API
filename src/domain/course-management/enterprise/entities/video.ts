import { AggregateRoot } from '@/core/entities/aggregate-root'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import { VideoUploadedEvent } from '../events/video-uploaded'

export interface VideoProps {
  videoName: string
  videoType: 'video/mp4' | 'video/avi'
  body: Buffer
  duration: number
  size: number
  videoKey?: string
  storedAt: Date
}

export class Video extends AggregateRoot<VideoProps> {
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

    const isNewVideo = !id

    if (isNewVideo) {
      video.addDomainEvent(new VideoUploadedEvent(video))
    }

    return video
  }
}
