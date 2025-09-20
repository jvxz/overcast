import type { z } from 'zod'

interface Params<T> {
  endpoint: string
  options?: Parameters<typeof $fetch>[1]
  schema: z.ZodType<T>
  manualClientId?: string
}

/**
 * hit the soundcloud api
 */
export async function $sc<T>({ endpoint, options, schema }: Params<T>) {
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
    throw createError({
      data: parsed.error,
      statusCode: 500,
      statusMessage: 'Failed to parse SoundCloud response',
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
      throw createError({
        statusCode: 404,
        statusMessage: 'Could not find resource. Did you provide a valid SoundCloud URL?',
      })
    }

    return res._data
  }

  return parsed.data
}
