import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }
}
