export function isTargetBusy(target: MaybeRefOrGetter<'index' | string & {}>) {
  const { isBusy } = useTrack()
  const serverStateTarget = useServerStateTarget()

  return computed(() => isBusy.value && toValue(target) === serverStateTarget.value)
}
