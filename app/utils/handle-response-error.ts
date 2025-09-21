export function handleResponseError(error: any) {
  if (error.response._data) {
    useServerError().serverError.value = error.response._data
  }

  if (error instanceof Error) {
    useServerError().serverError.value = {
      fatal: false,
      message: error.message ?? 'An unexpected error occurred',
      name: error.name ?? 'Error',
      statusCode: 500,
      unhandled: true,
    }
  }
}
