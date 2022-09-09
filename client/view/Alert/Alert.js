import { createTag } from '../../lib/utils'
import { onFormSubmit } from '../Form/Form'

let alertMessages = document.querySelector('[data-id=alert_messages]')

let formatText = text => `${text.replace(/`([^`]+)`/g, '<strong>$1</strong>')}`

export function showError(message, textarea) {
  let error = createTag('div', ['Alert', 'is-error'])
  error.innerHTML = formatText(message)
  error.role = 'alert'
  alertMessages.appendChild(error)

  textarea.setAttribute('aria-errormessage', 'form_error')
  textarea.setAttribute('aria-invalid', 'true')

  onFormSubmit(() => {
    textarea.removeAttribute('aria-errormessage')
    textarea.removeAttribute('aria-invalid')
    error.remove()
  })
}

export function showWarning(message) {
  let warning = createTag('div', ['Alert', 'is-warning'])
  warning.innerHTML = formatText(message)
  alertMessages.appendChild(warning)

  onFormSubmit(() => {
    warning.remove()
  })
}
