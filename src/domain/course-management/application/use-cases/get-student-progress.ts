import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type ClassWithStudentProgressDTO } from '../../enterprise/entities/dtos/class-with-student-progress'
import { ClassDtoMapper } from '../../enterprise/entities/dtos/mappers/class-dto-mapper'
import { ModuleDtoMapper } from '../../enterprise/entities/dtos/mappers/module-dto-mapper'
import { type ModuleWithStudentProgressDTO } from '../../enterprise/entities/dtos/module-with-student-progress'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type EnrollmentCompletedItemsRepository } from '../repositories/enrollment-completed-items-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'
import { type ModulesRepository } from '../repositories/modules-repository'

interface GetStudentProgressUseCaseRequest {
  enrollmentId: string
  studentId: string
}

type GetStudentProgressUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  classes: ClassWithStudentProgressDTO[]
  modules: ModuleWithStudentProgressDTO[]
}
>

export class GetStudentProgressUseCase implements UseCase<GetStudentProgressUseCaseRequest, GetStudentProgressUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly enrollmentCompletedItemsRepository: EnrollmentCompletedItemsRepository
  ) { }

  async exec({
    enrollmentId,
    studentId
  }: GetStudentProgressUseCaseRequest): Promise<GetStudentProgressUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.findById(enrollmentId)

    if (!enrollment) {
      return left(new ResourceNotFoundError())
    }

    const studentIsTheEnrollmentOwner = enrollment.studentId.toString() === studentId

    if (!studentIsTheEnrollmentOwner) {
      return left(new NotAllowedError())
    }

    const course = await this.coursesRepository.findById(enrollment.courseId.toString())

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const courseClasses = await this.modulesRepository.findManyClassesByCourseId(course.id.toString())

    const completedClasses = await this.enrollmentCompletedItemsRepository.findManyCompletedClassesByEnrollmentId(
      enrollmentId
    )
    const completedClassIds = completedClasses.map(completedClass => completedClass.itemId.toString())

    const classesProgression: ClassWithStudentProgressDTO[] = []

    courseClasses.forEach(courseClass => {
      const isClassCompleted = completedClassIds.includes(courseClass.id.toString())

      if (isClassCompleted) {
        const classWithProgress: ClassWithStudentProgressDTO = {
          class: ClassDtoMapper.toDTO(courseClass),
          completed: true
        }

        classesProgression.push(classWithProgress)
      } else {
        const classWithProgress: ClassWithStudentProgressDTO = {
          class: ClassDtoMapper.toDTO(courseClass),
          completed: false
        }

        classesProgression.push(classWithProgress)
      }
    })

    const courseModules = await this.modulesRepository.findManyByCourseId(course.id.toString())

    const completedModules = await this.enrollmentCompletedItemsRepository.findManyCompletedModulesByEnrollmentId(
      enrollmentId
    )
    const completedModuleIds = completedModules.map(completedModule => completedModule.itemId.toString())

    const modulesProgression: ModuleWithStudentProgressDTO[] = []

    courseModules.forEach(courseModule => {
      const isModuleCompleted = completedModuleIds.includes(courseModule.id.toString())

      if (isModuleCompleted) {
        const moduleWithProgress: ModuleWithStudentProgressDTO = {
          module: ModuleDtoMapper.toDTO(courseModule),
          completed: true
        }

        modulesProgression.push(moduleWithProgress)
      } else {
        const moduleWithProgress: ModuleWithStudentProgressDTO = {
          module: ModuleDtoMapper.toDTO(courseModule),
          completed: false
        }

        modulesProgression.push(moduleWithProgress)
      }
    })

    return right({
      classes: classesProgression,
      modules: modulesProgression
    })
  }
}
