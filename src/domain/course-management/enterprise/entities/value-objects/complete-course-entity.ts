import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { type Class } from '../class'
import { type CourseProps } from '../course'
import { type Module } from '../module'
import { type Instructor } from './../instructor'

export interface CompleteCourseEntityProps extends CourseProps {
  instructor: Instructor
  courseId: UniqueEntityID
  modules: Module[]
  classes: Class[]
}

export class CompleteCourseEntity extends ValueObject<CompleteCourseEntityProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get instructorId() {
    return this.props.instructorId
  }

  get coverImageKey() {
    return this.props.coverImageKey
  }

  get bannerImageKey() {
    return this.props.bannerImageKey
  }

  get createdAt() {
    return this.props.createdAt
  }

  get instructor() {
    return this.props.instructor
  }

  get courseId() {
    return this.props.courseId
  }

  get modules() {
    return this.props.modules
  }

  get classes() {
    return this.props.classes
  }

  static create(props: CompleteCourseEntityProps) {
    return new CompleteCourseEntity(props)
  }
}
