import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface EvaluationProps {
  value: number
  studentId: UniqueEntityID
  classId: UniqueEntityID
  createdAt: Date
}

export class Evaluation extends Entity<EvaluationProps> {
  get value() {
    return this.props.value
  }

  set value(value: number) {
    this.props.value = value
  }

  get studentId() {
    return this.props.studentId
  }

  get classId() {
    return this.props.classId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<EvaluationProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const evaluation = new Evaluation(
      {
        ...props,
        createdAt: props.createdAt ?? new Date()
      },
      id
    )

    return evaluation
  }
}
