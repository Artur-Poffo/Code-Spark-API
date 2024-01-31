import { type ClassVideoProps } from '../../enterprise/entities/class-video'
import { type Video } from '../../enterprise/entities/video'

export interface VideosRepository {
  findById: (id: string) => Promise<Video<ClassVideoProps> | null>
  create: (video: Video<ClassVideoProps>) => Promise<Video<ClassVideoProps>>
}
