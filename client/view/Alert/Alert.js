import { trackEvent } from '../../lib/analytics.js'
import { createTag } from '../../lib/utils'

function formatText(text) {
  return text
    .replace(/`([^`]+)`/g, '<strong>$1</strong>')
    .replace('and ', 'and ')
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
  let description = createTag('div', ['Alert_description'])
  let fix = createTag('div', ['Alert_action'])
  let link = createTag('a', ['QueryLink', 'is-fix'])
  link.setAttribute('data-query', fixed)
  description.innerHTML = formatText(message)
  warning.appendChild(description)
  link.innerHTML = 'Fix'
  link.href = '#' + new URLSearchParams({ q: fixed })
  fix.appendChild(link)
  warning.appendChild(fix)
  root.appendChild(warning)
  link.addEventListener('click', () => {
    trackEvent('Fix query', { props: { query: fixed } })
  })
  return { fix, warning }
}
