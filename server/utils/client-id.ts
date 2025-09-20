const message = 'Failed to refresh client ID. Please try again later, or contact support if the problem persists'

export async function getFreshClientId() {
  const res = await fetch('https://soundcloud.com/')

  const html = await res.text()

  const urls = html.match(
    /https:\/\/a-v2\.sndcdn\.com\/assets\/\d+-[a-f0-9]+\.js/g,
  )

  if (!urls?.length) {
    throw createError({
      message,
      statusCode: 500,
    })
  }

  const freshClientId = await Promise.any(urls.map(getClientIdFromUrl))

  if (!freshClientId) {
    throw createError({
      message,
      statusCode: 500,
    })
  }

  await useClientId().setClientId(freshClientId)

  return freshClientId
}

async function getClientIdFromUrl(url: string) {
  const res = await fetch(url)

  const html = await res.text()

  const clientId = html.match(/client_id:"([A-Z0-9]+)"/i)

  if (!clientId?.[1]) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject()
  }

  return clientId[1]
}

export function useClientId() {
  const storage = useStorage<string>('client-id')

  return {
    getClientId: async () => storage.getItem('value'),
    setClientId: (clientId: string) => storage.setItem('value', clientId),
  }
}
