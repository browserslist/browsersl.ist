import { setFormValues, submitForm } from '../Form/form.js'

let links = document.querySelectorAll('a.QueryLink')
links.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault()
    let queryAttr = item.getAttribute('data-query')
    if (queryAttr) {
      setFormValues({ query: queryAttr })
    } else {
      setFormValues({ query: item.innerText })
    }
    submitForm()
  })
})
