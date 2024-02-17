import { type Evaluation } from '@/domain/course-management/enterprise/entities/evaluation'
import { prisma } from '..'
import { type EvaluationsRepository } from './../../../../domain/course-management/application/repositories/evaluations-repository'
import { EvaluationMapper } from './../mappers/evaluation-mapper'

export class PrismaEvaluationsRepository implements EvaluationsRepository {
  async findById(id: string): Promise<Evaluation | null> {
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id
      }
    })

    if (!evaluation) {
      return null
    }

    const domainEvaluation = EvaluationMapper.toDomain(evaluation)

    return domainEvaluation
  }

  async findByStudentIdAndClassId(studentId: string, classId: string): Promise<Evaluation | null> {
    const evaluation = await prisma.evaluation.findFirst({
      where: {
        studentId,
        classId
      }
    })

    if (!evaluation) {
      return null
    }

    const domainEvaluation = EvaluationMapper.toDomain(evaluation)

    return domainEvaluation
  }

  async findManyByCourseId(courseId: string): Promise<Evaluation[]> {
    const evaluations = await prisma.evaluation.findMany({
      where: {
        class: {
          module: {
            courseId
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return evaluations.map(evaluation => EvaluationMapper.toDomain(evaluation))
  }

  async findManyByStudentId(studentId: string): Promise<Evaluation[]> {
    const evaluations = await prisma.evaluation.findMany({
      where: {
        studentId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return evaluations.map(evaluation => EvaluationMapper.toDomain(evaluation))
  }

  async findManyByClassId(classId: string): Promise<Evaluation[]> {
    const evaluations = await prisma.evaluation.findMany({
      where: {
        classId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return evaluations.map(evaluation => EvaluationMapper.toDomain(evaluation))
  }

  async create(evaluation: Evaluation): Promise<Evaluation> {
    const infraEvaluation = EvaluationMapper.toPrisma(evaluation)

    await prisma.evaluation.create({
      data: infraEvaluation
    })

    return evaluation
  }

  async save(evaluation: Evaluation): Promise<void> {
    const infraEvaluation = EvaluationMapper.toPrisma(evaluation)

    await prisma.evaluation.update({
      where: {
        id: infraEvaluation.id
      },
      data: infraEvaluation
    })
  }
}
