import { type FastifyInstance } from 'fastify'
import { getVideoDetailsController } from '../controllers/get-video-details'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function videoRoutes(app: FastifyInstance) {
  app.get('/videos/:videoKey', { onRequest: [verifyJwt] }, getVideoDetailsController)
}
