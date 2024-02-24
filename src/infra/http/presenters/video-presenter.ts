import { type Prisma } from '@prisma/client'

export class VideoPresenter {
  static toHTTP(video: Prisma.VideoUncheckedCreateInput) {
    return {
      id: video.id,
      videoKey: video.fileKey
    }
  }
}
