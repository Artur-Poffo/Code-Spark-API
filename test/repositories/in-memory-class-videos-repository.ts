import { type ClassVideosRepository } from '@/domain/course-management/application/repositories/class-videos-repository'
import { type ClassVideo } from '@/domain/course-management/enterprise/entities/class-video'

export class InMemoryClassVideosRepository implements ClassVideosRepository {
  public items: ClassVideo[] = []

  async findById(id: string): Promise<ClassVideo | null> {
    const classVideoToFind = this.items.find(classVideoToCompare => classVideoToCompare.id.toString() === id)

    if (!classVideoToFind) {
      return null
    }

    return classVideoToFind
  }

  async create(classVideo: ClassVideo): Promise<ClassVideo> {
    this.items.push(classVideo)
    return classVideo
  }
}
