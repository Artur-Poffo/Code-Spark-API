import { type Encrypter, type EncrypterProps } from '@/domain/course-management/application/cryptography/encrypter'
import { type FastifyReply } from 'fastify'

export class JWTEncrypter implements Encrypter {
  constructor(private readonly reply: FastifyReply) {}

  async encrypt(payload: EncrypterProps): Promise<string> {
    return await this.reply.jwtSign({ role: payload.role }, { sub: payload.sub })
  }
}
