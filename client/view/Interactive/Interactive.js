let container = document.querySelector('[data-id=interactive]')

export function scrollToInteractive() {
  container.scrollTo({ top: 0 })
  container.scrollIntoView()
}
