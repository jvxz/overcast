export const SOUNDCLOUD_API_URL = 'https://api-v2.soundcloud.com'
export const PRESIGNED_URL_EXPIRATION = 60 * 60 * 10

export type ServerState = typeof SERVER_STATE_EVENTS[number]
export const SERVER_STATE_EVENTS = ['downloading', 'idle', 'uploading'] as const
