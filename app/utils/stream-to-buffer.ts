export async function streamToBuffer(stream: ReadableStream) {
  const res = new Response(stream)
  return await res.arrayBuffer()
}
