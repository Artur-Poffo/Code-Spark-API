import { type FastifyReply, type FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: 'STUDENT' | 'INSTRUCTOR') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleToVerify) {
      return await reply.status(401).send({ message: 'Unauthorized' })
    }
  }
}
