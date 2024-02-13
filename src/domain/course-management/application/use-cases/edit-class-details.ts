import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Class } from '../../enterprise/entities/class'
import { type Video } from '../../enterprise/entities/video'
import { type ClassesRepository } from '../repositories/classes-repository'
import { type CoursesRepository } from './../repositories/courses-repository'
import { type ModulesRepository } from './../repositories/modules-repository'
import { type VideosRepository } from './../repositories/videos-repository'
import { ClassNumberIsAlreadyInUseError } from './errors/class-number-is-already-in-use-error'

interface EditClassDetailsUseCaseRequest {
  name?: string
  description?: string
  videoId?: string
  classNumber?: number
  classId: string
  instructorId: string
}

type EditClassDetailsUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError | ClassNumberIsAlreadyInUseError,
{
  class: Class
}
>

export class EditClassDetailsUseCase implements UseCase<EditClassDetailsUseCaseRequest, EditClassDetailsUseCaseResponse> {
  constructor(
    private readonly classesRepository: ClassesRepository,
    private readonly videosRepository: VideosRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly coursesRepository: CoursesRepository
  ) {}

  async exec({
    name,
    description,
    videoId,
    classNumber,
    classId,
    instructorId
  }: EditClassDetailsUseCaseRequest): Promise<EditClassDetailsUseCaseResponse> {
    const classToEdit = await this.classesRepository.findById(classId)

    if (!classToEdit) {
      return left(new ResourceNotFoundError())
    }

    const module = await this.modulesRepository.findById(classToEdit.moduleId.toString())

    if (!module) {
      return left(new ResourceNotFoundError())
    }

    const course = await this.coursesRepository.findById(module.courseId.toString())

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheOwner = course.instructorId.toString() === instructorId

    if (!instructorIsTheOwner) {
      return left(new NotAllowedError())
    }

    classToEdit.name = name ?? classToEdit.name
    classToEdit.description = description ?? classToEdit.description

    let video: Video | null = null

    if (videoId) {
      video = await this.videosRepository.findById(videoId)

      if (!video) {
        return left(new ResourceNotFoundError())
      }
    }

    classToEdit.videoId = video ? video.id : classToEdit.videoId

    if (classNumber) {
      const moduleClasses = await this.classesRepository.findManyByModuleId(classToEdit.moduleId.toString())
      const classWithSameNumber = moduleClasses.find(classToCompare => classToCompare.classNumber === classNumber)

      if (classWithSameNumber) {
        return left(new ClassNumberIsAlreadyInUseError(classNumber))
      }
    }

    classToEdit.classNumber = classNumber ?? classToEdit.classNumber

    return right({
      class: classToEdit
    })
  }
}
