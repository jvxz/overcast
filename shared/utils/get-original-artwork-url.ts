export function getOriginalArtworkUrl(url: string) {
  if (url.includes('-original.')) {
    return url
  }

  const jpeg = url.endsWith('.jpeg')
  const jpg = url.endsWith('.jpg')
  const png = url.endsWith('.png')

  const bareUrl = url
    .split('.')
    .slice(0, -1)
    .join('.')
    .split('-')
    .slice(0, -1)
    .join('-')

  const originalUrl = `${bareUrl}-original.${jpeg ? 'jpeg' : jpg ? 'jpg' : png ? 'png' : ''}`

  return originalUrl
}
