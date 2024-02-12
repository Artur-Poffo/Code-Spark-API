import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Student } from '../../enterprise/entities/student'
import { type StudentsRepository } from '../repositories/students-repository'

interface EditStudentDetailsUseCaseRequest {
  email?: string
  age?: number
  summary?: string
  profileImageKey?: string | null
  bannerImageKey?: string | null
  studentId: string
}

type EditStudentDetailsUseCaseResponse = Either<
ResourceNotFoundError,
{
  student: Student
}
>

export class EditStudentDetailsUseCase implements UseCase<EditStudentDetailsUseCaseRequest, EditStudentDetailsUseCaseResponse> {
  constructor(
    private readonly studentsRepository: StudentsRepository
  ) { }

  async exec({
    email,
    age,
    summary,
    profileImageKey,
    bannerImageKey,
    studentId
  }: EditStudentDetailsUseCaseRequest): Promise<EditStudentDetailsUseCaseResponse> {
    const student = await this.studentsRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError())
    }

    student.name = student.name
    student.email = email ?? student.email
    student.age = age ?? student.age
    student.summary = summary ?? student.summary
    student.profileImageKey = profileImageKey ?? student.profileImageKey
    student.bannerImageKey = bannerImageKey ?? student.bannerImageKey

    await this.studentsRepository.save(student)

    return right({
      student
    })
  }
}
