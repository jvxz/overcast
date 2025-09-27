export function toCapitalized(str: MaybeRefOrGetter<string>) {
  return computed(() => toValue(str).charAt(0).toUpperCase() + toValue(str).slice(1))
}
