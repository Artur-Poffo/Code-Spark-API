import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { type Optional } from '@/core/types/optional'
import { type CourseProps } from '../course'
import { type InstructorProps } from '../instructor'

export interface InstructorWithCoursesProps extends Optional<InstructorProps, 'passwordHash' | 'cpf'> {
  instructorId: UniqueEntityID
  courses: CourseProps[]
}

export class InstructorWithCourses extends ValueObject<InstructorWithCoursesProps> {
  get instructorId() {
    return this.props.instructorId
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get age() {
    return this.props.age
  }

  get summary() {
    return this.props.summary
  }

  get profileImageKey() {
    return this.props.profileImageKey
  }

  get bannerImageKey() {
    return this.props.bannerImageKey
  }

  get registeredAt() {
    return this.props.registeredAt
  }

  get courses() {
    return this.props.courses
  }

  static create(props: InstructorWithCoursesProps) {
    return new InstructorWithCourses(props)
  }
}
