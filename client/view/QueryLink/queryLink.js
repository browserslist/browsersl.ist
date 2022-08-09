import { submitForm } from '../Form/form.js'

let links = document.querySelectorAll('a[data-query]')
links.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault()
    submitForm(item.getAttribute('data-query'))
  })
})
