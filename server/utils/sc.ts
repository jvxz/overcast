import { z } from 'zod'

interface Params<T> {
  endpoint: string
  options?: Parameters<typeof $fetch>[1]
  schema: z.ZodType<T>
  manualClientId?: string
  type?: 'track' | 'artist' | 'playlist'
}

/**
 * hit the soundcloud api
 */
export async function $sc<T>({ endpoint, options, schema, type }: Params<T>) {
  const { getClientId } = useClientId()

  let clientId = await getClientId()

  if (!clientId) {
    clientId = await getFreshClientId()
  }

  const url = endpoint.startsWith('http') ? endpoint : `${SOUNDCLOUD_API_URL}${endpoint}`

  let res = await runFetch()

  // retry once if the client id is invalid (401)
  if (res === 'RETRY') {
    clientId = await getFreshClientId()
    res = await runFetch()
  }

  const parsed = schema.safeParse(res)

  if (!parsed.success) {
    if (type === 'track') {
      throw createError({
        data: z.treeifyError(parsed.error),
        statusCode: 422,
        statusMessage: `Failed to parse track data. Did you provide a valid URL?`,
      })
    }

    if (type === 'artist') {
      throw createError({
        data: z.treeifyError(parsed.error),
        statusCode: 422,
        statusMessage: `Failed to parse artist data. Did you provide a valid URL?`,
      })
    }

    if (type === 'playlist') {
      throw createError({
        data: z.treeifyError(parsed.error),
        statusCode: 422,
        statusMessage: `Failed to parse playlist data. Did you provide a valid URL?`,
      })
    }

    throw createError({
      data: z.treeifyError(parsed.error),
      statusCode: 422,
      statusMessage: `Failed to parse SoundCloud response`,
    })
  }

  async function runFetch(manualClientId?: string) {
    const res = await $fetch.raw(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },

      ignoreResponseError: true,
      params: {
        ...options?.params,
        client_id: manualClientId ?? clientId,
      },
      retry: false,
    })

    if (res.status === 401) {
      return 'RETRY'
    }

    if (res.status === 404) {
      if (type === 'track') {
        throw createError({
          statusCode: 404,
          statusMessage: `Could not find track. Did you provide a valid URL?`,
        })
      }

      if (type === 'artist') {
        throw createError({
          statusCode: 404,
          statusMessage: `Could not find artist. Did you provide a valid URL?`,
        })
      }

      if (type === 'playlist') {
        throw createError({
          statusCode: 404,
          statusMessage: `Could not find playlist. Did you provide a valid URL?`,
        })
      }

      throw createError({
        statusCode: 404,
        statusMessage: 'Could not find resource. Did you provide a valid SoundCloud URL?',
      })
    }

    return res._data
  }

  return parsed.data
}
