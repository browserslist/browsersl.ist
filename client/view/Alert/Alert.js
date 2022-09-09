import { createTag } from '../../lib/utils'

function formatText(text) {
  return `${text.replace(/`([^`]+)`/g, '<strong>$1</strong>')}`
}

export function buildError(root, message) {
  let error = createTag('div', ['Alert', 'is-error'])
  error.innerHTML = formatText(message)
  error.role = 'alert'
  root.appendChild(error)
  return error
}

export function buildWarning(root, message) {
  let warning = createTag('div', ['Alert', 'is-warning'])
  warning.innerHTML = formatText(message)
  root.appendChild(warning)
  return warning
}
