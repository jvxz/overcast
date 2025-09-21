export function getTranscodingUrl(trackData: TrackData) {
  const url
    = trackData.media.transcodings.find((transcoding) => {
      if (transcoding.preset === 'mp3_1_0')
        return transcoding.url
      if (transcoding.preset === 'mp3_0_0')
        return transcoding.url
      if (transcoding.preset === 'mp3_0_1')
        return transcoding.url
      if (transcoding.preset === 'mp3_standard')
        return transcoding.url
      return false
    })?.url

  if (!url) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not get audio URL from track data',
    })
  }

  return url
}
