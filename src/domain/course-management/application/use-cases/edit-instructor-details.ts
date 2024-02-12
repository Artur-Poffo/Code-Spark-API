import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Instructor } from '../../enterprise/entities/instructor'
import { type InstructorsRepository } from '../repositories/instructors-repository'

interface EditInstructorDetailsUseCaseRequest {
  email?: string
  age?: number
  summary?: string
  profileImageKey?: string | null
  bannerImageKey?: string | null
  instructorId: string
}

type EditInstructorDetailsUseCaseResponse = Either<
ResourceNotFoundError,
{
  instructor: Instructor
}
>

export class EditInstructorDetailsUseCase implements UseCase<EditInstructorDetailsUseCaseRequest, EditInstructorDetailsUseCaseResponse> {
  constructor(
    private readonly instructorsRepository: InstructorsRepository
  ) { }

  async exec({
    email,
    age,
    summary,
    profileImageKey,
    bannerImageKey,
    instructorId
  }: EditInstructorDetailsUseCaseRequest): Promise<EditInstructorDetailsUseCaseResponse> {
    const instructor = await this.instructorsRepository.findById(instructorId)

    if (!instructor) {
      return left(new ResourceNotFoundError())
    }

    instructor.name = instructor.name
    instructor.email = email ?? instructor.email
    instructor.age = age ?? instructor.age
    instructor.summary = summary ?? instructor.summary
    instructor.profileImageKey = profileImageKey ?? instructor.profileImageKey
    instructor.bannerImageKey = bannerImageKey ?? instructor.bannerImageKey

    await this.instructorsRepository.save(instructor)

    return right({
      instructor
    })
  }
}
