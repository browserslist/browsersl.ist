let container = document.querySelector('[data-id=hedgehog]')

export function toggleHedgehog(isShown) {
  container.hidden = !isShown
}
