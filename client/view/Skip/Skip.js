import { focusForm } from '../Form/Form.js'

let skip = document.querySelector('[data-id=skip]')

skip.addEventListener('click', () => {
  focusForm()
})
