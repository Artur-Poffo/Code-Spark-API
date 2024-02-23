import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Class } from '../../enterprise/entities/class'
import { EnrollmentCompletedItem } from '../../enterprise/entities/enrollment-completed-item'
import { type Module } from '../../enterprise/entities/module'
import { type ClassesRepository } from '../repositories/classes-repository'
import { type EnrollmentCompletedItemsRepository } from '../repositories/enrollment-completed-items-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'
import { type StudentsRepository } from '../repositories/students-repository'
import { type ModulesRepository } from './../repositories/modules-repository'
import { AllClassesInTheModuleMustBeMarkedAsCompleted } from './errors/all-classes-in-the-module-must-be-marked-as-completed'

interface MarkModuleAsCompletedUseCaseRequest {
  enrollmentId: string
  studentId: string
  moduleId: string
}

type MarkModuleAsCompletedUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError | AllClassesInTheModuleMustBeMarkedAsCompleted,
{
  module: Module
}
>

export class MarkModuleAsCompletedUseCase implements UseCase<MarkModuleAsCompletedUseCaseRequest, MarkModuleAsCompletedUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly classesRepository: ClassesRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly enrollmentCompletedItemsRepository: EnrollmentCompletedItemsRepository
  ) { }

  async exec({
    enrollmentId,
    studentId,
    moduleId
  }: MarkModuleAsCompletedUseCaseRequest): Promise<MarkModuleAsCompletedUseCaseResponse> {
    const [enrollment, student, module] = await Promise.all([
      this.enrollmentsRepository.findById(enrollmentId),
      this.studentsRepository.findById(studentId),
      this.modulesRepository.findById(moduleId)
    ])

    if (!enrollment || !student || !module) {
      return left(new ResourceNotFoundError())
    }

    const studentIsTheEnrollmentOwner = enrollment.studentId.toString() === studentId

    if (!studentIsTheEnrollmentOwner) {
      return left(new NotAllowedError())
    }

    const courseModules = await this.modulesRepository.findManyByCourseId(enrollment.courseId.toString())
    const courseModulesIds = courseModules.map(moduleToMap => moduleToMap.id.toString())

    const moduleToMarkAsCompletedExistsInThisCourse = courseModulesIds.includes(moduleId)

    if (!moduleToMarkAsCompletedExistsInThisCourse) {
      return left(new ResourceNotFoundError())
    }

    const moduleClasses = await this.classesRepository.findManyByModuleId(moduleId)
    const completedClassesItems = await this.enrollmentCompletedItemsRepository.findManyCompletedClassesByEnrollmentId(enrollmentId)

    const completedClasses: Class[] = []

    await Promise.all(
      completedClassesItems.map(async completedItem => {
        if (completedItem.type === 'CLASS') {
          const classToAdd = await this.classesRepository.findById(completedItem.itemId.toString())

          if (classToAdd) {
            completedClasses.push(classToAdd)
          }
        }
      })
    )

    const allClassesOfThisModuleIsCompleted = moduleClasses.every(classToCompare => {
      return completedClasses.includes(classToCompare)
    })

    if (!allClassesOfThisModuleIsCompleted) {
      return left(new AllClassesInTheModuleMustBeMarkedAsCompleted(module.name))
    }

    const completedItem = EnrollmentCompletedItem.create({
      enrollmentId: enrollment.id,
      itemId: module.id,
      type: 'MODULE'
    })
    await this.enrollmentCompletedItemsRepository.create(completedItem)

    return right({
      module
    })
  }
}
