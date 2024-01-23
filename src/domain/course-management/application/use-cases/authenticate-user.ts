import { left, right, type Either } from '@/core/either'
import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type HashComparer } from '@/domain/course-management/application/cryptography/hash-comparer'
import { type Encrypter } from './../cryptography/encrypter'
import { type UsersRepository } from './../repositories/users-repository'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
WrongCredentialsError,
{
  accessToken: string
}
>

export class AuthenticateUserUseCase implements UseCase<AuthenticateUserUseCaseRequest, AuthenticateUserUseCaseResponse> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) { }

  async exec({
    email,
    password
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const doesPasswordsMatch = await this.hashComparer.compare(password, user.passwordHash)

    if (!doesPasswordsMatch) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString()
    })

    return right({
      accessToken
    })
  }
}
