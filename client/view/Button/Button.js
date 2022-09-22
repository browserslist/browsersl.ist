import { createTag } from '../../lib/utils'

export function buildButton(root, title) {
  let button = createTag('button', ['Button'])
  button.setAttribute('type', 'button')
  button.textContent = title
  root.appendChild(button)
  return button
}
