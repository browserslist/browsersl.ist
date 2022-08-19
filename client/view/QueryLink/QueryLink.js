import { setFormValues, submitForm } from '../Form/Form.js'

let queryContainer = document.querySelector('[data-id=query_container]')
let links = document.querySelectorAll('a.QueryLink')

links.forEach(item => {
  let queryAttr = item.getAttribute('data-query')
  let query = queryAttr || item.innerText.trim()

  item.setAttribute('href', `?q=${query}`)

  item.addEventListener('click', e => {
    e.preventDefault()

    setFormValues({ query })

    submitForm()

    queryContainer.scrollTo({ top: 0 })
    queryContainer.scrollIntoView()
  })
})
