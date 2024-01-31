import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Class } from '../../enterprise/entities/class'
import { type ClassVideosRepository } from '../repositories/class-videos-repository'
import { type ClassesRepository } from '../repositories/classes-repository'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type ModulesRepository } from '../repositories/modules-repository'
import { ClassAlreadyExistsInThisModuleError } from './errors/class-already-exists-in-this-module-error'
import { ClassNumberIsAlreadyInUseError } from './errors/class-number-is-already-in-use-error'
import { ClassVideoRequiredError } from './errors/class-video-required-error'

interface AddClassToModuleUseCaseRequest {
  name: string
  description: string
  classVideoId: string
  classNumber: number
  moduleId: string
  instructorId: string
}

type AddClassToModuleUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError | ClassAlreadyExistsInThisModuleError | ClassNumberIsAlreadyInUseError,
{
  class: Class
}
>

export class AddClassToModuleUseCase implements UseCase<AddClassToModuleUseCaseRequest, AddClassToModuleUseCaseResponse> {
  constructor(
    private readonly classesRepository: ClassesRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly classVideosRepository: ClassVideosRepository
  ) {}

  async exec({
    name,
    description,
    classVideoId,
    classNumber,
    moduleId,
    instructorId
  }: AddClassToModuleUseCaseRequest): Promise<AddClassToModuleUseCaseResponse> {
    const module = await this.modulesRepository.findById(moduleId)

    if (!module) {
      return left(new ResourceNotFoundError())
    }

    const completeCourse = await this.coursesRepository.findCompleteCourseEntityById(module.courseId.toString())

    if (!completeCourse) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheSponsor = completeCourse.instructorId.toString() === instructorId

    if (!instructorIsTheSponsor) {
      return left(new NotAllowedError())
    }

    const classesInThisModule = completeCourse.classes.filter(classToCompare => classToCompare.moduleId.toString() === moduleId)
    const classWithSameNameInSameModule = classesInThisModule.find(classToCompare => classToCompare.name === name)

    if (classWithSameNameInSameModule) {
      return left(new ClassAlreadyExistsInThisModuleError(moduleId))
    }

    const classWithSamePositionInThisModule = classesInThisModule.find(classToCompare => classToCompare.classNumber === classNumber)

    if (classWithSamePositionInThisModule) {
      return left(new ClassNumberIsAlreadyInUseError(classNumber))
    }

    const classVideo = await this.classVideosRepository.findById(classVideoId)

    if (!classVideo) {
      return left(new ClassVideoRequiredError())
    }

    const classToAdd = Class.create({
      name,
      description,
      classVideoId: classVideo.id,
      classNumber,
      moduleId: module.id
    })

    await this.classesRepository.create(classToAdd)

    return right({
      class: classToAdd
    })
  }
}
