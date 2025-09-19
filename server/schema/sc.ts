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

export type UserData = z.infer<typeof UserSchema>
export const UserSchema = z.object({
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
  creator_subscription: z.object({
    product: z.object({ id: z.string() }),
  }),
  creator_subscriptions: z.array(
    z.object({ product: z.object({ id: z.string() }) }),
  ),
  date_of_birth: z.null(),
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
})

export type TrackData = z.infer<typeof TrackSchema>
export const TrackSchema = z
  .object({
    artwork_url: z.string().nullable(),
    caption: z.string().nullable(),
    comment_count: z.number().nullable(),
    commentable: z.boolean(),
    created_at: z.string(),
    description: z.string().nullable(),
    display_date: z.string(),
    download_count: z.number().nullable(),
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
    likes_count: z.number().nullable(),
    media: z.object({
      transcodings: z.array(
        z.object({
          duration: z.number(),
          format: z.object({
            mime_type: z.string(),
            protocol: z.string(),
          }),
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
    playback_count: z.number().nullable(),
    policy: z.string(),
    public: z.boolean(),
    publisher_metadata: z
      .object({
        artist: z.string().optional(),
        id: z.number(),
        urn: z.string(),
      })
      .nullable(),
    purchase_title: z.string().nullable(),
    purchase_url: z.string().nullable(),
    release_date: z.string().nullable(),
    reposts_count: z.number(),
    secret_token: z.null(),
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
    user: UserSchema.omit({
      comments_count: true,
      created_at: true,
      creator_subscription: true,
      creator_subscriptions: true,
      date_of_birth: true,
      description: true,
      followings_count: true,
      groups_count: true,
      likes_count: true,
      playlist_count: true,
      playlist_likes_count: true,
      reposts_count: true,
      track_count: true,
      visuals: true,
    }),
    user_id: z.number(),
    visuals: UserSchema.shape.visuals,
    waveform_url: z.string(),
  })

export type UserTracksData = z.infer<typeof UserTracksSchema>
export const UserTracksSchema = z.object({
  collection: z.array(TrackSchema),
  next_href: z.string().nullable(),
  total: z.number().optional(),
})
