import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Class } from '../../enterprise/entities/class'
import { type ClassesRepository } from '../repositories/classes-repository'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type ModulesRepository } from '../repositories/modules-repository'
import { ClassAlreadyExistsInThisModule } from './errors/class-already-exists-in-this-module'

interface AddClassToModuleUseCaseRequest {
  name: string
  description: string
  duration: number
  videoKey: string
  classNumber: number
  moduleId: string
  instructorId: string
}

type AddClassToModuleUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError | ClassAlreadyExistsInThisModule,
{
  class: Class
}
>

export class AddClassToModuleUseCase implements UseCase<AddClassToModuleUseCaseRequest, AddClassToModuleUseCaseResponse> {
  constructor(
    private readonly classesRepository: ClassesRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly coursesRepository: CoursesRepository
  ) {}

  async exec({
    name,
    description,
    duration,
    classNumber,
    videoKey,
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
      return left(new ClassAlreadyExistsInThisModule(moduleId))
    }

    const classToAdd = Class.create({
      name,
      description,
      duration,
      videoKey,
      classNumber,
      moduleId: new UniqueEntityID(moduleId)
    })

    await this.classesRepository.create(classToAdd)

    return right({
      class: classToAdd
    })
  }
}
