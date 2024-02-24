import toStream from 'buffer-to-stream'
import getVideoDurationInSeconds from 'get-video-duration'

export class GetVideoDuration {
  async getInSecondsByBuffer(videoBuffer: Buffer): Promise<number> {
    const videoStream = toStream(videoBuffer)

    const duration = await getVideoDurationInSeconds(
      videoStream
    )

    return duration
  }
}
