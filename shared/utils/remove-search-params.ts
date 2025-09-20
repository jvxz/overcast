export function removeSearchParams(url: string) {
  const urlObj = new URL(url)
  urlObj.search = ''
  return urlObj.href
}
