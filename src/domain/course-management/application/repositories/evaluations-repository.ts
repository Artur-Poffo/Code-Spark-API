import { type Evaluation } from '../../enterprise/entities/evaluation'

export interface EvaluationsRepository {
  findById: (id: string) => Promise<Evaluation | null>
  findByStudentIdAndClassId: (studentId: string, classId: string) => Promise<Evaluation | null>
  create: (evaluation: Evaluation) => Promise<Evaluation>
}
