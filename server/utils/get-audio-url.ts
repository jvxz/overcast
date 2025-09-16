import { Data, Effect, pipe } from 'effect'

class TrackAudioUrlError extends Data.TaggedError('TrackAudioUrlError')<EffectH3Error> {}

export function getAudioUrl(trackData: TrackData) {
  return pipe(
    Effect.fromNullable(
      trackData.media.transcodings.find((transcoding) => {
        if (transcoding.preset === 'mp3_1_0')
          return transcoding.url
        if (transcoding.preset === 'mp3_0_0')
          return transcoding.url
        if (transcoding.preset === 'mp3_0_1')
          return transcoding.url
        if (transcoding.preset === 'mp3_standard')
          return transcoding.url
        return false
      })?.url,
    ),
    Effect.mapError(e => new TrackAudioUrlError({
      cause: e,
      message: 'Failed to get audio URL',
      statusCode: 500,
    })),
  )
}
