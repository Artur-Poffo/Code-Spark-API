import { left, right, type Either } from '@/core/either'
import { type UseCase } from '@/core/use-cases/use-case'
import { Student } from '../../enterprise/entities/student'
import { type HashGenerator } from '../cryptography/hash-generator'
import { type StudentsRepository } from '../repositories/students-repository'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
  age: number
  cpf: string
  summary: string
}

type RegisterStudentUseCaseResponse = Either<
StudentAlreadyExistsError,
{
  student: Student
}
>

export class RegisterStudentUseCase implements UseCase<RegisterStudentUseCaseRequest, RegisterStudentUseCaseResponse> {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashGenerator: HashGenerator
  ) { }

  async exec({
    name,
    email,
    password,
    age,
    cpf,
    summary
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmailOrCpf =
      await Promise.all([
        this.studentsRepository.findByEmail(email),
        this.studentsRepository.findByCpf(cpf)
      ])

    if (studentWithSameEmailOrCpf[0] ?? studentWithSameEmailOrCpf[1]) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      passwordHash: hashedPassword,
      age,
      cpf,
      summary
    })

    await this.studentsRepository.create(student)

    return right({
      student
    })
  }
}
