import { submitForm } from '../Form/form.js'

let links = document.querySelectorAll('a.QueryLink')
links.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault()
    let queryAttr = item.getAttribute('data-query')
    if (queryAttr) {
      submitForm(queryAttr)
    } else {
      submitForm(item.innerText)
    }
  })
})
