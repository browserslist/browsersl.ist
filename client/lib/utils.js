export function debounce(callback, delay) {
  let timeout
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(callback, delay)
  }
}

export function formatPercent(percent) {
  let rounded = percent < 1 ? percent.toFixed(2) : percent.toFixed(1)
  return rounded + ' %'
}

export function createTag(tag, classes = [], text) {
  let el = document.createElement(tag)
  el.classList.add(...classes)
  if (text) el.innerText = text
  return el
}
