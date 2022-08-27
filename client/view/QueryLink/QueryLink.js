import { DEFAULT_REGION } from '../../data/regions.js'
import { setFormValues, submitForm } from '../Form/Form.js'
import { scrollToInteractive } from '../Interactive/Interactive.js'

let links = document.querySelectorAll('a.QueryLink')

for (let link of links) {
  let queryAttr = link.getAttribute('data-query')
  let query = queryAttr || link.textContent.trim()

  link.href = '?' + new URLSearchParams({ q: query })

  link.addEventListener('click', e => {
    e.preventDefault()
    let region = new URL(link.href).searchParams.get('region')

    setFormValues({ query, region })
    submitForm()
    scrollToInteractive()
  })
}

export function updateQueryLinksRegion(region) {
  for (let link of links) {
    let linkParams = new URL(link.href).searchParams
    let prevRegion = linkParams.get('region')

    if (region === prevRegion) {
      return
    }

    if (region !== DEFAULT_REGION) {
      linkParams.set('region', region)
    } else {
      linkParams.delete('region')
    }

    link.setAttribute('href', '?' + linkParams)
  }
}
