export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export interface Uploader {
  upload: (params: UploadParams) => Promise<{ url: string }>
}
