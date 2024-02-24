import { type VideosRepository } from '@/domain/course-management/application/repositories/videos-repository'
import { type Video } from '@/domain/course-management/enterprise/entities/video'

export class InMemoryVideosRepository implements VideosRepository {
  items: Video[] = []

  async findById(id: string): Promise<Video | null> {
    const video = this.items.find(videoToCompare => videoToCompare.id.toString() === id)

    if (!video) {
      return null
    }

    return video
  }

  async findByVideoKey(key: string): Promise<Video | null> {
    const video = this.items.find(videoToFind => videoToFind.videoKey === key)

    if (!video) {
      return null
    }

    return video
  }

  async appendVideoKey(videoKey: string, id: string): Promise<Video | null> {
    const videoToAppendKey = this.items.find(videoToCompare => videoToCompare.id.toString() === id)

    if (!videoToAppendKey) {
      return null
    }

    if (!videoToAppendKey.videoKey) {
      videoToAppendKey.videoKey = videoKey
      const videoIndex = this.items.indexOf(videoToAppendKey)

      this.items[videoIndex] = videoToAppendKey
    }

    return videoToAppendKey
  }

  async create(video: Video): Promise<Video> {
    this.items.push(video)

    return video
  }
}
