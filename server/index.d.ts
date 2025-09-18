import type * as Minio from 'minio'

declare module 'h3' {
  interface H3EventContext {
    minio: Minio.Client
  }
}

export {}
