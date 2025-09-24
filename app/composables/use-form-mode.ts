export function useFormMode() {
  return useState('form-mode', () => 'track' as SubmitMode)
}
