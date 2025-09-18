const MAX = 255

export function sanitizeFilename(input: string) {
  const lastDot = input.lastIndexOf('.')
  const hasExt = lastDot > 0 && lastDot < input.length - 1
  const base = hasExt ? input.slice(0, lastDot) : input
  const ext = hasExt ? input.slice(lastDot + 1) : ''

  // eslint-disable-next-line no-control-regex
  const invalid = /[<>:"/\\|?*\u0000-\u001F]/g

  let cleanBase = base.replace(invalid, '_')

  const reserved = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])$/i
  if (reserved.test(cleanBase))
    cleanBase = `_${cleanBase}`
  cleanBase = cleanBase.replace(/^[ .]+|[ .]+$/g, '')
  if (!cleanBase)
    cleanBase = 'untitled'

  const cleanExt = ext
    .replace(invalid, '')
    .replace(/^[ .]+|[ .]+$/g, '')
    .slice(0, 50)

  let result = cleanExt ? `${cleanBase}.${cleanExt}` : cleanBase
  if (result.length > MAX) {
    const over = result.length - MAX
    cleanBase = cleanBase.slice(0, Math.max(1, cleanBase.length - over))
    result = cleanExt ? `${cleanBase}.${cleanExt}` : cleanBase
  }

  return result
}
