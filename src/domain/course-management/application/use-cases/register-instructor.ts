import { left, right, type Either } from '@/core/either'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Instructor } from '../../enterprise/entities/instructor'
import { Student } from '../../enterprise/entities/student'
import { type HashGenerator } from '../cryptography/hash-generator'
import { type InstructorsRepository } from '../repositories/instructors-repository'
import { InstructorAlreadyExistsError } from './errors/instructor-already-exists-error'
import { type StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterInstructorUseCaseRequest {
  name: string
  email: string
  password: string
  age: number
  cpf: string
  summary: string
}

type RegisterInstructorUseCaseResponse = Either<
StudentAlreadyExistsError,
{
  instructor: Instructor
}
>

export class RegisterInstructorUseCase implements UseCase<RegisterInstructorUseCaseRequest, RegisterInstructorUseCaseResponse> {
  constructor(
    private readonly instructorRepository: InstructorsRepository,
    private readonly hashGenerator: HashGenerator
  ) { }

  async exec({
    name,
    email,
    password,
    age,
    cpf,
    summary
  }: RegisterInstructorUseCaseRequest): Promise<RegisterInstructorUseCaseResponse> {
    const instructorWithSameEmailOrCpf =
      await Promise.all([
        this.instructorRepository.findByEmail(email),
        this.instructorRepository.findByCpf(cpf)
      ])

    if (instructorWithSameEmailOrCpf[0] ?? instructorWithSameEmailOrCpf[1]) {
      return left(new InstructorAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const instructor = Student.create({
      name,
      email,
      passwordHash: hashedPassword,
      age,
      cpf,
      summary
    })

    await this.instructorRepository.create(instructor)

    return right({
      instructor
    })
  }
}
