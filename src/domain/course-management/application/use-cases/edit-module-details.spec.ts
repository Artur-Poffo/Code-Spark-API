import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeModule } from '../../../../../test/factories/make-module'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentCompletedItemsRepository } from '../../../../../test/repositories/in-memory-enrollment-completed-items-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { EditModuleDetailsUseCase } from './edit-module-details'
import { ModuleNumberIsAlreadyInUseError } from './errors/module-number-already-in-use-error'

let inMemoryEnrollmentCompletedItemsRepository: InMemoryEnrollmentCompletedItemsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: EditModuleDetailsUseCase

describe('Edit module details use case', () => {
  beforeEach(() => {
    inMemoryEnrollmentCompletedItemsRepository = new InMemoryEnrollmentCompletedItemsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryStudentsRepository, inMemoryEnrollmentCompletedItemsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new EditModuleDetailsUseCase(
      inMemoryModulesRepository,
      inMemoryCoursesRepository
    )
  })

  it('should be able to edit module details', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'John Doe Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const result = await sut.exec({
      name: 'New Module Name',
      moduleId: module.id.toString(),
      instructorId: instructor.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      module: expect.objectContaining({
        name: 'New Module Name'
      })
    })
  })

  it('should not be able to edit module details of a inexistent module', async () => {
    const result = await sut.exec({
      moduleId: 'inexistentModuleId',
      instructorId: 'inexistentInstructorId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit module details if the instructor not if the owner', async () => {
    const owner = makeInstructor()
    const wrongInstructor = makeInstructor()

    await Promise.all([
      inMemoryInstructorsRepository.create(owner),
      inMemoryInstructorsRepository.create(wrongInstructor)
    ])

    const course = makeCourse({ name: 'John Doe Course', instructorId: owner.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const result = await sut.exec({
      name: 'New Module Name',
      moduleId: module.id.toString(),
      instructorId: wrongInstructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to update module number if the module number is already in use', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'John Doe Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const moduleToConflict = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    const moduleToEdit = makeModule({
      courseId: course.id,
      moduleNumber: 2
    })

    await Promise.all([
      inMemoryModulesRepository.create(moduleToConflict),
      inMemoryModulesRepository.create(moduleToEdit)
    ])

    const result = await sut.exec({
      name: 'New Class Name',
      moduleNumber: 1,
      moduleId: moduleToEdit.id.toString(),
      instructorId: instructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ModuleNumberIsAlreadyInUseError)
  })
})
