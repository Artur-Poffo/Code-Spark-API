import { type Encrypter, type EncrypterProps } from '@/domain/course-management/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: EncrypterProps): Promise<string> {
    return JSON.stringify(payload)
  }
}
