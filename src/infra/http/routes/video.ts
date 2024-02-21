import { upload } from '@/infra/app'
import { makeOnVideoUploaded } from '@/infra/events/factories/make-on-video-uploaded'
import { type FastifyInstance } from 'fastify'
import { uploadVideoController } from '../controllers/upload-video'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function videoRoutes(app: FastifyInstance) {
  makeOnVideoUploaded()

  app.post('/videos', { onRequest: [verifyJwt], preHandler: [upload.single('file')] }, uploadVideoController)
}
