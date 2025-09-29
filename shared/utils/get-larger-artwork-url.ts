export function getLargerArtworkUrl(url: string) {
  if (url.includes('-original.')) {
    return url
  }

  const jpeg = url.endsWith('.jpeg')
  const jpg = url.endsWith('.jpg')
  const png = url.endsWith('.png')

  const ext = jpeg ? 'jpeg' : jpg ? 'jpg' : png ? 'png' : ''

  const bareUrl = url
    .split('.')
    .slice(0, -1)
    .join('.')
    .split('-')
    .slice(0, -1)
    .join('-')

  return `${bareUrl}-t500x500.${ext}`
}
