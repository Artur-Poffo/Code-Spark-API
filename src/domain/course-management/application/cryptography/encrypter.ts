export interface EncrypterProps {
  role: 'STUDENT' | 'INSTRUCTOR'
  sub: string
}

export interface Encrypter {
  encrypt: (payload: EncrypterProps) => Promise<string>
}
