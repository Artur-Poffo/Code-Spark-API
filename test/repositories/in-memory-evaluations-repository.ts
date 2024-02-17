import { type Evaluation } from '@/domain/course-management/enterprise/entities/evaluation'
import { type EvaluationsRepository } from './../../src/domain/course-management/application/repositories/evaluations-repository'
import { type InMemoryModulesRepository } from './in-memory-modules-repository'

export class InMemoryEvaluationsRepository implements EvaluationsRepository {
  items: Evaluation[] = []

  constructor(
    private readonly inMemoryModulesRepository: InMemoryModulesRepository
  ) {}

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

  async findManyByCourseId(courseId: string): Promise<Evaluation[]> {
    const courseClasses = await this.inMemoryModulesRepository.findManyClassesByCourseId(courseId)
    const courseClassIds = courseClasses.map(courseClassToMap => courseClassToMap.id.toString())

    const courseEvaluations: Evaluation[] = []

    courseClassIds.forEach(courseClassIdToMap => {
      const evaluations = this.items.filter(evaluationToFind => evaluationToFind.classId.toString() === courseClassIdToMap)

      if (evaluations.length > 0) {
        courseEvaluations.push(...evaluations)
      }
    })

    return courseEvaluations
  }

  async findManyByStudentId(studentId: string): Promise<Evaluation[]> {
    return this.items.filter(evaluationToFind => evaluationToFind.studentId.toString() === studentId)
  }

  async findManyByClassId(classId: string): Promise<Evaluation[]> {
    return this.items.filter(evaluationToCompare => evaluationToCompare.classId.toString() === classId)
  }

  async create(evaluation: Evaluation): Promise<Evaluation> {
    this.items.push(evaluation)
    return evaluation
  }

  async save(evaluation: Evaluation): Promise<void> {
    const evaluationIndex = this.items.indexOf(evaluation)
    this.items[evaluationIndex] = evaluation
  }
}
