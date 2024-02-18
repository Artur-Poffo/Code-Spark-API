import { makeUserMapper } from '../../mappers/factories/make-user-mapper'
import { PrismaUsersRepository } from './../prisma-users-repository'

export function makePrismaUsersRepository() {
  const userMapper = makeUserMapper()
  const prismaUsersRepository = new PrismaUsersRepository(userMapper)

  return prismaUsersRepository
}
