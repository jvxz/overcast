export function handleResponseError(potentialError: any) {
  if (potentialError.response._data && potentialError.response._data.error) {
    useServerError().serverError.value = potentialError.response._data
  }

  if (potentialError instanceof Error) {
    useServerError().serverError.value = {
      fatal: false,
      message: potentialError.message ?? 'An unexpected error occurred',
      name: potentialError.name ?? 'Error',
      statusCode: 500,
      unhandled: true,
    }
  }
}
