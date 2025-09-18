import { ID3Writer } from 'browser-id3-writer'

export async function writeTrackTags({ audioBuffer, trackMeta }: { audioBuffer: ArrayBufferLike, trackMeta: TrackData }) {
  const writer = new ID3Writer(audioBuffer)

  const tags: Record<string, string | string[] | { description: string, text: string } | null> = {
    APIC: trackMeta.artwork_url?.replace('large', 'original') ?? trackMeta.user.avatar_url.replace('large', 'original'),
    COMM: trackMeta.description
      ? {
          description: 'Comment',
          text: trackMeta.description,
        }
      : null,
    TCON: trackMeta.genre ? [trackMeta.genre] : null,
    TDAT: trackMeta.display_date,
    TIT2: trackMeta.title,
    TPE1: [trackMeta.publisher_metadata?.artist ?? trackMeta.user.full_name],
    WOAS: trackMeta.permalink_url,
  }

  await Promise.all(Object.entries(tags).map(async ([tag, value]) => {
    if (value === null) {
      return
    }

    if (tag === 'APIC') {
      const arrayBuffer = await $fetch<ArrayBufferLike>(getOriginalArtworkUrl(value as string), {
        responseType: 'arrayBuffer',
      })

      writer.setFrame('APIC', {
        data: arrayBuffer,
        description: 'Attached cover',
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
