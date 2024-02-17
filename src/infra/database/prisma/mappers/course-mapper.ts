import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type CourseTagsRepository } from '@/domain/course-management/application/repositories/course-tags-repository'
import { type EnrollmentsRepository } from '@/domain/course-management/application/repositories/enrollments-repository'
import { type ModulesRepository } from '@/domain/course-management/application/repositories/modules-repository'
import { Course } from '@/domain/course-management/enterprise/entities/course'
import { type Prisma, type Course as PrismaCourse } from '@prisma/client'
import { type CertificatesRepository } from './../../../../domain/course-management/application/repositories/certificates-repository'

export class CourseMapper {
  constructor(
    private readonly certificatesRepository: CertificatesRepository,
    private readonly courseTagsRepository: CourseTagsRepository,
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly modulesRepository: ModulesRepository
  ) {}

  static toDomain(raw: PrismaCourse): Course {
    return Course.create(
      {
        name: raw.name,
        description: raw.description,
        instructorId: new UniqueEntityID(raw.instructorId),
        bannerImageKey: raw.bannerImageKey,
        coverImageKey: raw.coverImageKey,
        createdAt: raw.createdAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(course: Course): Promise<Prisma.CourseUncheckedCreateInput> {
    const certificate = await this.certificatesRepository.findByCourseId(course.id.toString())
    const courseTags = await this.courseTagsRepository.findManyByCourseId(course.id.toString())
    const enrollments = await this.enrollmentsRepository.findManyByCourseId(course.id.toString())
    const modules = await this.modulesRepository.findManyByCourseId(course.id.toString())

    return {
      id: course.id.toString(),
      name: course.name,
      description: course.description,
      instructorId: course.instructorId.toString(),
      bannerImageKey: course.bannerImageKey,
      coverImageKey: course.coverImageKey,
      createdAt: course.createdAt,
      certificate: certificate
        ? {
            connect: {
              id: certificate.id.toString()
            }
          }
        : undefined,
      courseTags: {
        connect: courseTags.map(courseTag => ({ id: courseTag.id.toString() }))
      },
      enrollments: {
        connect: enrollments.map(enrollment => ({ id: enrollment.id.toString() }))
      },
      modules: {
        connect: modules.map(module => ({ id: module.id.toString() }))
      }
    }
  }
}
