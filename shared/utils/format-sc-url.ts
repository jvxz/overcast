export function formatScUrl(url: string) {
  const urlObj = new URL(url)
  urlObj.search = ''

  if (urlObj.href.endsWith('/')) {
    return urlObj.href.slice(0, -1)
  }

  return urlObj.href
}
