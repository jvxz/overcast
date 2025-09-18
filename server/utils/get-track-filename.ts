export function getTrackFilename(trackData: TrackData) {
  return sanitizeFilename(`${trackData.publisher_metadata?.artist ?? trackData.user.username} - ${trackData.title}.mp3`)
}
