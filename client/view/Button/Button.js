import { createTag } from '../../lib/utils'

export function buildButton(root) {
  let button = createTag('button', ['Button'])
  button.setAttribute('type', 'button')
  button.innerHTML = 'Fix'
  root.appendChild(button)
  return button
}
