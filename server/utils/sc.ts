import type { z } from 'zod'

interface Params<T> {
  endpoint: string
  options?: Parameters<typeof $fetch>[1]
  schema: z.ZodType<T>
  manualClientId?: string
}

let retryCount = 0

/**
 * hit the soundcloud api
 */
export async function $sc<T>({ endpoint, options, schema }: Params<T>) {
  try {
    return await action()
  }
  catch (err) {
    if (err instanceof Error && err.message === 'RETRY') {
      retryCount++

      if (retryCount >= 1) {
        retryCount = 0

        throw createError({
          message: 'An unexpected error occured while accessing SoundCloud\'s API. Please try again',
          statusCode: 500,
          statusMessage: 'ClientIdError',
          unhandled: false,
        })
      }

      await getFreshClientId()
      return await action()
    }

    throw err
  }

  async function action() {
    const { getClientId } = useClientId()

    const clientId = await getClientId()

    if (!clientId) {
      throw new Error('RETRY')
    }

    const url = endpoint.startsWith('http') ? endpoint : `${SOUNDCLOUD_API_URL}${endpoint}`

    const res = await $fetch(url, {
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },
      onResponseError: (res) => {
        switch (res.response.status) {
          case 401: throw new Error('RETRY')
          case 404: throw createError({
            data: res.response._data,
            statusCode: 404,
            statusMessage: 'Could not find resource. Did you provide a valid URL?',
          })
          default: throw createError({
            data: res.response._data,
            message: 'An unexpected error occured while accessing SoundCloud\'s API. Please try again',
            statusCode: res.response.status,
            statusMessage: res.response.statusText,
          })
        }
      },
      params: {
        ...options?.params,
        client_id: clientId,
      },
      ...options,
      retry: false,
    })

    const parsed = schema.safeParse(res)

    if (!parsed.success) {
      throw createError({
        data: parsed.error,
        statusCode: 500,
        statusMessage: 'Failed to parse SoundCloud response',
      })
    }

    return parsed.data
  }
}
