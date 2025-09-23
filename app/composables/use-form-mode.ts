export const useFormMode = createGlobalState(() => ({
  formMode: ref<SubmitMode>('track'),
}))
