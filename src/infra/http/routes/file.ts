import { upload } from '@/infra/app'
import { type FastifyInstance } from 'fastify'
import { uploadFileController } from '../controllers/upload-file'
import { verifyJwt } from '../middlewares/verify-jwt'

export async function fileRoutes(app: FastifyInstance) {
  app.post('/files', { onRequest: [verifyJwt], preHandler: [upload.single('file')] }, uploadFileController)
}
