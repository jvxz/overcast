export default defineEventHandler(async (event) => {
  // eslint-disable-next-line no-console
  console.log(`\u001B[90m[\u001B[32m${event.method}\u001B[90m]\u001B[0m \u001B[37m${event.node.req.url}\u001B[0m`)
})
