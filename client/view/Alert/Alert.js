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

export function buildSuggestion(root, fill) {
  let suggestion = createTag('div', ['Alert', 'is-suggestion'])
  let description = createTag('div', ['Alert_description'])
  suggestion.role = 'status'
  suggestion.dataset.id = 'form_region_banner'
  fill(description)
  suggestion.append(description)
  root.append(suggestion)
  return suggestion
}

export function buildWarning(root, message, fixed) {
  let warning = createTag('div', ['Alert', 'is-warning'])
  let description = createTag('div', ['Alert_description'])
  let fix = createTag('div', ['Alert_action'])
  let link = createTag('a', ['ConfigLink', 'is-fix'])
  link.setAttribute('data-config', fixed)
  description.innerHTML = formatText(message)
  warning.appendChild(description)
  link.innerHTML = 'Fix'
  link.href = '#' + new URLSearchParams({ q: fixed })
  fix.appendChild(link)
  warning.appendChild(fix)
  root.appendChild(warning)
  link.addEventListener('click', () => {
    trackEvent('Fix config', { props: { config: fixed } })
  })
  return { fix, warning }
}
