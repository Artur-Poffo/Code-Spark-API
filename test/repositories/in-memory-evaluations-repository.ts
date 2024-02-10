import { type Evaluation } from '@/domain/course-management/enterprise/entities/evaluation'
import { type EvaluationsRepository } from './../../src/domain/course-management/application/repositories/evaluations-repository'

export class InMemoryEvaluationsRepository implements EvaluationsRepository {
  items: Evaluation[] = []

  async findById(id: string): Promise<Evaluation | null> {
    const evaluation = this.items.find(evaluationToFind => evaluationToFind.id.toString() === id)

    if (!evaluation) {
      return null
    }

    return evaluation
  }

  async findByStudentIdAndClassId(studentId: string, classId: string): Promise<Evaluation | null> {
    const evaluation = this.items.find(evaluationToFind => {
      if (evaluationToFind.studentId.toString() === studentId && evaluationToFind.classId.toString() === classId) {
        return evaluationToFind
      }

      return null
    })

    if (!evaluation) {
      return null
    }

    return evaluation
  }

  async create(evaluation: Evaluation): Promise<Evaluation> {
    this.items.push(evaluation)
    return evaluation
  }
}
