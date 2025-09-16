import { z } from 'zod'

export const SoundCloudUrlSchema = z.url({
  error: 'Invalid URL, must be a SoundCloud URL',
  hostname: /^(on.)?soundcloud.com$/,
}).transform((hostname) => {
  if (hostname === 'on.soundcloud.com') {
    return fetch(hostname).then(redirectRes => redirectRes.url)
  }

  return hostname
})

export type TrackData = z.infer<typeof TrackDataSchema>
export const TrackDataSchema = z.object({
  artwork_url: z.string().nullable(),
  caption: z.union([z.string(), z.null()]),
  comment_count: z.number(),
  commentable: z.boolean(),
  created_at: z.string(),
  description: z.string().nullable(),
  display_date: z.string(),
  download_count: z.number(),
  downloadable: z.boolean(),
  duration: z.number(),
  embeddable_by: z.string(),
  full_duration: z.number(),
  genre: z.string().nullable(),
  has_downloads_left: z.boolean(),
  id: z.number(),
  kind: z.string(),
  label_name: z.string().nullable(),
  last_modified: z.string(),
  license: z.string(),
  likes_count: z.number(),
  media: z.object({
    transcodings: z.array(
      z.object({
        duration: z.number(),
        format: z.object({ mime_type: z.string(), protocol: z.string() }),
        is_legacy_transcoding: z.boolean(),
        preset: z.union([
          z.literal('mp3_1_0'),
          z.literal('mp3_0_1'),
          z.literal('mp3_0_0'),
          z.literal('opus_0_0'),
          z.literal('aac_160k'),
          z.literal('abr_sq'),
          z.literal('mp3_standard'),
        ]),
        quality: z.string(),
        snipped: z.boolean(),
        url: z.string(),
      }),
    ),
  }),
  monetization_model: z.string(),
  permalink: z.string(),
  permalink_url: z.string(),
  playback_count: z.number(),
  policy: z.string(),
  public: z.boolean(),
  publisher_metadata: z
    .object({
      artist: z.string().optional(),
      explicit: z.boolean().optional(),
      id: z.number(),
      urn: z.string(),
    })
    .nullable(),
  purchase_title: z.string().nullable(),
  purchase_url: z.string().nullable(),
  release_date: z.string().nullable(),
  reposts_count: z.number(),
  secret_token: z.string().nullable(),
  sharing: z.string(),
  state: z.string(),
  station_permalink: z.string(),
  station_urn: z.string(),
  streamable: z.boolean(),
  tag_list: z.string(),
  title: z.string(),
  track_authorization: z.string(),
  uri: z.string(),
  urn: z.string(),
  user: z.object({
    avatar_url: z.string(),
    badges: z.object({
      creator_mid_tier: z.boolean(),
      pro: z.boolean(),
      pro_unlimited: z.boolean(),
      verified: z.boolean(),
    }),
    city: z.string().nullable(),
    comments_count: z.number(),
    country_code: z.string().nullable(),
    created_at: z.string(),
    creator_subscription: z.object({ product: z.object({ id: z.string() }) }),
    creator_subscriptions: z.array(
      z.object({ product: z.object({ id: z.string() }) }),
    ),
    description: z.string().nullable(),
    first_name: z.string(),
    followers_count: z.number(),
    followings_count: z.number(),
    full_name: z.string(),
    groups_count: z.number(),
    id: z.number(),
    kind: z.string(),
    last_modified: z.string(),
    last_name: z.string(),
    likes_count: z.number(),
    permalink: z.string(),
    permalink_url: z.string(),
    playlist_count: z.number(),
    playlist_likes_count: z.number(),
    reposts_count: z.null(),
    station_permalink: z.string(),
    station_urn: z.string(),
    track_count: z.number(),
    uri: z.string(),
    urn: z.string(),
    username: z.string(),
    verified: z.boolean(),
    visuals: z
      .object({
        enabled: z.boolean(),
        tracking: z.null(),
        urn: z.string(),
        visuals: z.array(
          z.object({
            entry_time: z.number(),
            urn: z.string(),
            visual_url: z.string(),
          }),
        ),
      })
      .nullable(),
  }),
  user_id: z.number(),
  visuals: z
    .object({
      enabled: z.boolean(),
      tracking: z.null(),
      urn: z.string(),
      visuals: z.array(
        z.object({
          entry_time: z.number(),
          urn: z.string(),
          visual_url: z.string(),
        }),
      ),
    })
    .nullable(),
  waveform_url: z.string(),
})
