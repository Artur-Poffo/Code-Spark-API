import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Class } from '@/domain/course-management/enterprise/entities/class'
import { type Prisma, type Class as PrismaClass } from '@prisma/client'

export class ClassMapper {
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

  static toPrisma(classToPrisma: Class): Prisma.ClassUncheckedCreateInput {
    // const evaluations = await this.evaluationsRepository.findManyByClassId(classToPrisma.id.toString())
    // const infraEvaluations = evaluations.map(evaluation => EvaluationMapper.toPrisma(evaluation))

    return {
      id: classToPrisma.id.toString(),
      name: classToPrisma.name,
      description: classToPrisma.description,
      classNumber: classToPrisma.classNumber,
      moduleId: classToPrisma.moduleId.toString(),
      videoId: classToPrisma.videoId.toString()
      // evaluations: infraEvaluations -> type conflict
    }
  }
}
