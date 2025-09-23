export function isTargetDownloading(target: MaybeRefOrGetter<'index' | string & {}>) {
  const { isDownloadingTrack } = useMutationState()
  const serverStateTarget = useServerStateTarget()

  return computed(() => isDownloadingTrack.value && toValue(target) === serverStateTarget.value)
}
