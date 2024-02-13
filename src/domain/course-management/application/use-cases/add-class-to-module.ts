import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Class } from '../../enterprise/entities/class'
import { type ClassesRepository } from '../repositories/classes-repository'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type ModulesRepository } from '../repositories/modules-repository'
import { type VideosRepository } from './../repositories/videos-repository'
import { ClassAlreadyExistsInThisModuleError } from './errors/class-already-exists-in-this-module-error'
import { ClassNumberIsAlreadyInUseError } from './errors/class-number-is-already-in-use-error'
import { ClassVideoRequiredError } from './errors/class-video-required-error'

interface AddClassToModuleUseCaseRequest {
  name: string
  description: string
  videoId: string
  classNumber: number
  moduleId: string
  instructorId: string
}

type AddClassToModuleUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError | ClassAlreadyExistsInThisModuleError | ClassNumberIsAlreadyInUseError | ClassVideoRequiredError,
{
  class: Class
}
>

export class AddClassToModuleUseCase implements UseCase<AddClassToModuleUseCaseRequest, AddClassToModuleUseCaseResponse> {
  constructor(
    private readonly classesRepository: ClassesRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly videosRepository: VideosRepository
  ) {}

  async exec({
    name,
    description,
    videoId,
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

    const instructorIsTheOwner = completeCourse.instructor.id.toString() === instructorId

    if (!instructorIsTheOwner) {
      return left(new NotAllowedError())
    }

    const courseClasses: Class[] = await this.modulesRepository.findManyClassesByCourseId(completeCourse.course.id.toString())

    const classesInThisModule = courseClasses.filter(classToCompare => classToCompare.moduleId.toString() === moduleId)
    const classWithSameNameInSameModule = classesInThisModule.find(classToCompare => classToCompare.name === name)

    if (classWithSameNameInSameModule) {
      return left(new ClassAlreadyExistsInThisModuleError(moduleId))
    }

    const classWithSamePositionInThisModule = classesInThisModule.find(classToCompare => classToCompare.classNumber === classNumber)

    if (classWithSamePositionInThisModule) {
      return left(new ClassNumberIsAlreadyInUseError(classNumber))
    }

    const video = await this.videosRepository.findById(videoId)

    if (!video) {
      return left(new ClassVideoRequiredError())
    }

    const classToAdd = Class.create({
      name,
      description,
      videoId: video.id,
      classNumber,
      moduleId: module.id
    })

    await this.classesRepository.create(classToAdd)

    return right({
      class: classToAdd
    })
  }
}
