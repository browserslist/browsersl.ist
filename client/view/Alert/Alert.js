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

export function buildWarning(root, message, fixed) {
  let warning = createTag('div', ['Alert', 'is-warning'])
  let fix = createTag('a', ['QueryLink', 'is-fix'])
  fix.setAttribute('data-query', fixed)
  warning.innerHTML = formatText(message)
  fix.innerHTML = '<code>Fix</code>'
  fix.href = '#' + new URLSearchParams({ q: fixed })
  warning.appendChild(fix)
  root.appendChild(warning)
  return { warning, fix }
}
