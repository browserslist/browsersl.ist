import { setFormValues, submitForm } from '../Form/Form.js'
import { scrollToInteractive } from '../Interactive/Interactive.js'

let links = document.querySelectorAll('a.QueryLink')

links.forEach(item => {
  let queryAttr = item.getAttribute('data-query')
  let query = queryAttr || item.textContent.trim()

  item.setAttribute('href', `?q=${query}`)

  item.addEventListener('click', e => {
    e.preventDefault()

    setFormValues({ query })

    submitForm()
    scrollToInteractive()
  })
})
