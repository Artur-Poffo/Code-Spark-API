import { type FastifyInstance } from 'fastify'
import { getImageDetailsController } from '../controllers/get-image-details'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function imageRoutes(app: FastifyInstance) {
  app.get('/images/:fileKey', { onRequest: [verifyJwt] }, getImageDetailsController)
}
