import { type Prisma } from '@prisma/client'

export class UserPresenter {
  static toHTTP(user: Prisma.UserUncheckedCreateInput) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      age: user.age,
      summary: user.summary,
      role: user.role,
      profileImageKey: user.profileImageKey,
      bannerImageKey: user.bannerImageKey,
      registeredAt: user.registeredAt
    }
  }
}
