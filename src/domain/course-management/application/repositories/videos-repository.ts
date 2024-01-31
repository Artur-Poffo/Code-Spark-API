import { type Video } from '../../enterprise/entities/video'

export interface VideosRepository {
  findById: (id: string) => Promise<Video | null>
  create: (video: Video) => Promise<Video>
}
