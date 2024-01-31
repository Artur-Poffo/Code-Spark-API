import { type ClassVideo } from '../../enterprise/entities/class-video'

export interface ClassVideosRepository {
  findById: (id: string) => Promise<ClassVideo | null>
  create: (classVideo: ClassVideo) => Promise<ClassVideo>
}
