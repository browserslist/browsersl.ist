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
  let fix = createTag('div', ['Alert_action'])
  let link = createTag('a', ['QueryLink', 'is-fix'])
  link.setAttribute('data-query', fixed)
  warning.innerHTML = formatText(message)
  link.innerHTML = '<code>Fix</code>'
  link.href = '#' + new URLSearchParams({ q: fixed })
  fix.appendChild(link)
  warning.appendChild(fix)
  root.appendChild(warning)
  return { warning, fix }
}
