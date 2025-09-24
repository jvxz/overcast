export function downloadFile(url: string, filename = 'download') {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  a.remove()
}
