import { setFormValues, submitForm } from '../Form/form.js'

const queryContainer = document.querySelector('[data-id=query_container]')
const links = document.querySelectorAll('a.QueryLink')

links.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault()
    let queryAttr = item.getAttribute('data-query')
    if (queryAttr) {
      setFormValues({ query: queryAttr })
    } else {
      setFormValues({ query: item.innerText.trim() })
    }

    submitForm()

    queryContainer.scrollTo({ top: 0 })
    queryContainer.scrollIntoView()
  })
})
