export function handleResponseError(potentialError: any) {
  const serverError = useServerError()

  if (potentialError.response._data && potentialError.response._data.error) {
    serverError.value = potentialError.response._data
  }

  if (potentialError instanceof Error) {
    serverError.value = {
      fatal: false,
      message: potentialError.message ?? 'An unexpected error occurred',
      name: potentialError.name ?? 'Error',
      statusCode: 500,
      unhandled: true,
    }
  }
}
