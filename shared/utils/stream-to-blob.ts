export async function streamToBlob(
  stream: ReadableStream<Uint8Array>,
  type?: string,
): Promise<Blob> {
  const blob = await new Response(stream).blob()
  return type && blob.type !== type ? blob.slice(0, blob.size, type) : blob
}
