import { ID3Writer } from 'browser-id3-writer'
import { saveAs } from 'file-saver'

export const useTrack = createSharedComposable(() => {
  const { isPending: isDownloadingTrack, mutate: downloadTrack } = useMutation({
    mutationFn: async (url: string) => {
      const [audioMeta, audioStream] = await Promise.all([
        $fetch<TrackData>('/api/track/meta', {
          query: {
            url,
          },
        }),
        $fetch<ReadableStream>('/api/track', {
          query: {
            url,
          },
          responseType: 'stream',
        }),
      ])

      const audioBuffer = await streamToBuffer(audioStream)

      return {
        audioMeta,
        blob: await writeId3(audioBuffer, audioMeta),
      }
    },
    onSuccess: ({ audioMeta, blob }) => {
      saveAs(blob, `${audioMeta.publisher_metadata?.artist ?? audioMeta.user.full_name} - ${audioMeta.title}.mp3`)
    },
  })

  return {
    downloadTrack,
    isDownloadingTrack,
  }
})

async function writeId3(audioBuffer: ArrayBufferLike, audioMeta: TrackData) {
  const writer = new ID3Writer(audioBuffer)

  const tags: Record<string, string | string[] | { description: string, text: string } | null> = {
    APIC: audioMeta.artwork_url?.replace('large', 'original') ?? audioMeta.user.avatar_url.replace('large', 'original'),
    COMM: audioMeta.description
      ? {
          description: 'Comment',
          text: audioMeta.description,
        }
      : null,
    TCON: audioMeta.genre ? [audioMeta.genre] : null,
    TDAT: audioMeta.display_date,
    TIT2: audioMeta.title,
    TPE1: [audioMeta.publisher_metadata?.artist ?? audioMeta.user.full_name],
    WOAS: audioMeta.permalink_url,
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

  writer.addTag()
  return writer.getBlob()
}
