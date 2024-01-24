import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { FakeEncrypter } from './../../../../../test/cryptography/fake-encrypter'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryUsersRepository } from './../../../../../test/repositories/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user'

let inMemoryCoursesRepository: InMemoryCoursesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate user use case', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository(inMemoryCoursesRepository)
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(inMemoryInstructorsRepository, inMemoryStudentsRepository)
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(inMemoryUsersRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate a user', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      passwordHash: await fakeHasher.hash('12345')
    })

    await inMemoryUsersRepository.create(student)

    const result = await sut.exec({
      email: student.email,
      password: '12345'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    })
  })

  it('should be able to authenticate a student or instructor - whatever', async () => {
    const instructor = makeInstructor({
      email: 'johndoe@example.com',
      passwordHash: await fakeHasher.hash('12345')
    })

    await inMemoryUsersRepository.create(instructor)

    const result = await sut.exec({
      email: instructor.email,
      password: '12345'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    })
  })

  it('should not be able to authenticate a user with wrong email', async () => {
    const email = 'johndoe@example.com'

    const student = makeStudent({
      email,
      passwordHash: await fakeHasher.hash('12345')
    })

    await inMemoryUsersRepository.create(student)

    const result = await sut.exec({
      email: 'wrongEmail@example.com',
      password: '12345'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate a user with wrong password', async () => {
    const password = '12345'

    const student = makeStudent({
      email: 'johndoe@example.com',
      passwordHash: await fakeHasher.hash(password)
    })

    await inMemoryUsersRepository.create(student)

    const result = await sut.exec({
      email: 'johndoe@example.com',
      password: 'wrongPassword'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
