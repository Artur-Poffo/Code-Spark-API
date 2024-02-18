import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCertificate } from '../../../../../test/factories/make-certificate'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentCompletedItemsRepository } from '../../../../../test/repositories/in-memory-enrollment-completed-items-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryCertificatesRepository } from './../../../../../test/repositories/in-memory-certificates-repository'
import { DeleteCourseCertificateUseCase } from './delete-course-certificate'

let inMemoryEnrollmentCompletedItemsRepository: InMemoryEnrollmentCompletedItemsRepository
let inMemoryCertificatesRepository: InMemoryCertificatesRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: DeleteCourseCertificateUseCase

describe('Delete course certificate use case', () => {
  beforeEach(() => {
    inMemoryEnrollmentCompletedItemsRepository = new InMemoryEnrollmentCompletedItemsRepository()
    inMemoryCertificatesRepository = new InMemoryCertificatesRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryStudentsRepository, inMemoryEnrollmentCompletedItemsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new DeleteCourseCertificateUseCase(
      inMemoryCertificatesRepository,
      inMemoryCoursesRepository,
      inMemoryInstructorsRepository
    )
  })

  it('should be able to delete a course certificate', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'John Doe Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const certificate = makeCertificate({ courseId: course.id })
    await inMemoryCertificatesRepository.create(certificate)

    const result = await sut.exec({
      courseId: course.id.toString(),
      certificateId: certificate.id.toString(),
      instructorId: instructor.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCertificatesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a course certificate from a inexistent course', async () => {
    const result = await sut.exec({
      courseId: 'inexistentCourseId',
      certificateId: 'inexistentCertificateId',
      instructorId: 'inexistentInstructorId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a course if the instructor not is the owner', async () => {
    const owner = makeInstructor()
    const wrongInstructor = makeInstructor()

    await Promise.all([
      inMemoryInstructorsRepository.create(owner),
      inMemoryInstructorsRepository.create(wrongInstructor)
    ])

    const course = makeCourse({ name: 'John Doe Course', instructorId: owner.id })
    await inMemoryCoursesRepository.create(course)

    const certificate = makeCertificate({ courseId: course.id })
    await inMemoryCertificatesRepository.create(certificate)

    const result = await sut.exec({
      courseId: course.id.toString(),
      certificateId: certificate.id.toString(),
      instructorId: wrongInstructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
