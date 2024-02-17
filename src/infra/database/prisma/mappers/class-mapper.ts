import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Class } from '@/domain/course-management/enterprise/entities/class'
import { type Prisma, type Class as PrismaClass } from '@prisma/client'
import { type EvaluationsRepository } from './../../../../domain/course-management/application/repositories/evaluations-repository'

export class ClassMapper {
  constructor(
    private readonly evaluationsRepository: EvaluationsRepository
  ) {}

  static toDomain(raw: PrismaClass): Class {
    return Class.create(
      {
        name: raw.name,
        description: raw.description,
        classNumber: raw.classNumber,
        moduleId: new UniqueEntityID(raw.moduleId),
        videoId: new UniqueEntityID(raw.videoId)
      },
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(classToPrisma: Class): Promise<Prisma.ClassUncheckedCreateInput> {
    const evaluations = await this.evaluationsRepository.findManyByClassId(classToPrisma.id.toString())

    return {
      id: classToPrisma.id.toString(),
      name: classToPrisma.name,
      description: classToPrisma.description,
      classNumber: classToPrisma.classNumber,
      moduleId: classToPrisma.moduleId.toString(),
      videoId: classToPrisma.videoId.toString(),
      evaluations: {
        connect: evaluations.map(evaluation => ({ id: evaluation.id.toString() }))
      }
    }
  }
}
