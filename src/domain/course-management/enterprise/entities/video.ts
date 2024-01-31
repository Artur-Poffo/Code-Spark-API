import { Entity } from '@/core/entities/entity'

export interface VideoProps {
  videoName: string
  videoType: string
  body: Buffer
  duration: number
}

export abstract class Video<Props extends VideoProps> extends Entity<Props> {
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
}
