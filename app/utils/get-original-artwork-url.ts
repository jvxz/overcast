export function getOriginalArtworkUrl(url: string) {
  if (url.includes('-original.')) {
    return url
  }

  const jpeg = url.endsWith('.jpeg')
  const jpg = url.endsWith('.jpg')
  const png = url.endsWith('.png')

  if (jpeg) {
    return `${url.slice(0, -5)}-original.jpg`
  }

  if (jpg || png) {
    return `${url.slice(0, -4)}-original.${jpg ? 'jpg' : 'png'}`
  }

  return url
}
