export const SOUNDCLOUD_API_URL = 'https://api-v2.soundcloud.com'
export const PRESIGNED_URL_EXPIRATION = 60 * 60 * 10

export type ServerState = typeof SERVER_STATE_EVENTS[number]
export const SERVER_STATE_EVENTS = ['downloading', 'idle', 'uploading', 'zipping'] as const

export type SubmitMode = typeof SUBMIT_MODES[number]
export const SUBMIT_MODES = ['track', 'artist', 'playlist', 'multi'] as const

export const DATE_FORMAT_STRING = 'MMM D, YYYY, hh:mm a'
