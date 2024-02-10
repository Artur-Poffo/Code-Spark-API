import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCertificate } from '../../../../../test/factories/make-certificate'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeEnrollment } from '../../../../../test/factories/make-enrollment'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryCertificatesRepository } from '../../../../../test/repositories/in-memory-certificates-repository'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryStudentCertificatesRepository } from './../../../../../test/repositories/in-memory-student-certificates-repository'
import { CertificateHasAlreadyBeenIssued } from './errors/certificate-has-already-been-issued-error'
import { IssueCertificateUseCase } from './issue-certificate'

let inMemoryCertificatesRepository: InMemoryCertificatesRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryStudentCertificatesRepository: InMemoryStudentCertificatesRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: IssueCertificateUseCase

describe('Issue certificate use case', () => {
  beforeEach(() => {
    inMemoryCertificatesRepository = new InMemoryCertificatesRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryStudentCertificatesRepository = new InMemoryStudentCertificatesRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new IssueCertificateUseCase(
      inMemoryCertificatesRepository,
      inMemoryStudentCertificatesRepository,
      inMemoryEnrollmentsRepository,
      inMemoryStudentsRepository
    )
  })

  it('should be able to issue a certificate of a course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'John Doe Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const certificate = makeCertificate({ courseId: course.id })
    await inMemoryCertificatesRepository.create(certificate)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ studentId: student.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    // Mark enrollment as completed
    await inMemoryEnrollmentsRepository.markAsCompleted(enrollment)

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      studentId: student.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryEnrollmentsRepository.items).toHaveLength(1)
  })

  it('should not be able to issue a certificate from a inexistent enrollment', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'John Doe Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const certificate = makeCertificate({ courseId: course.id })
    await inMemoryCertificatesRepository.create(certificate)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const result = await sut.exec({
      enrollmentId: 'inexistentEnrollmentId',
      studentId: student.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to issue a inexistent certificate of a course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'John Doe Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ studentId: student.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    // Mark enrollment as completed
    await inMemoryEnrollmentsRepository.markAsCompleted(enrollment)

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      studentId: student.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to issue a same certificate from a enrollment twice', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'John Doe Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const certificate = makeCertificate({ courseId: course.id })
    await inMemoryCertificatesRepository.create(certificate)

    const enrollment = makeEnrollment({ studentId: student.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    // Mark enrollment as completed
    await inMemoryEnrollmentsRepository.markAsCompleted(enrollment)

    await sut.exec({
      enrollmentId: enrollment.id.toString(),
      studentId: student.id.toString()
    })

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      studentId: student.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CertificateHasAlreadyBeenIssued)
  })
})
