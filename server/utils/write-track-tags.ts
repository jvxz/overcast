import { ID3Writer } from 'browser-id3-writer'

export async function writeTrackTags({ audioBuffer, trackMeta }: { audioBuffer: ArrayBufferLike, trackMeta: TrackData }) {
  const writer = new ID3Writer(audioBuffer)

  const tags: Record<string, string | string[] | { description: string, text: string } | null> = {
    APIC: await getOriginalArtworkUrl(trackMeta.artwork_url ?? trackMeta.user.avatar_url),
    COMM: trackMeta.description
      ? {
          description: 'comment',
          text: trackMeta.description,
        }
      : null,
    TCON: trackMeta.genre ? [trackMeta.genre] : null,
    TIT2: trackMeta.title,
    TPE1: [trackMeta.publisher_metadata?.artist ?? trackMeta.user.username],
    TYER: trackMeta.display_date.slice(0, 4),
    WOAS: trackMeta.permalink_url,
  }

  await Promise.all(Object.entries(tags).map(async ([tag, value]) => {
    if (value === null) {
      return
    }

    if (tag === 'APIC') {
      const arrayBuffer = await $fetch<ArrayBufferLike>(await getOriginalArtworkUrl(value as string), {
        responseType: 'arrayBuffer',
      })

      writer.setFrame('APIC', {
        data: arrayBuffer,
        description: 'attached cover',
        // CoverFront = 0x03
        type: 0x03,
      })

      return
    }

    // @ts-expect-error - browser-id3-writer types are bad, verified in source
    writer.setFrame(tag, value)
  }))

  return writer.addTag()
}
