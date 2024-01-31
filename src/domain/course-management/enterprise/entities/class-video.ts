import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Video, type VideoProps } from './video'

export interface ClassVideoProps extends VideoProps {
  classId: UniqueEntityID
}

export class ClassVideo extends Video<ClassVideoProps> {
  get classId() {
    return this.props.classId
  }

  static create(
    props: ClassVideoProps,
    id?: UniqueEntityID
  ) {
    const classVideo = new ClassVideo(
      {
        ...props
      },
      id
    )

    return classVideo
  }
}
