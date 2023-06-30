import { DEFAULT_REGION } from '../../data/regions.js'
import { setFormValues, submitForm } from '../Form/Form.js'
import { scrollToInteractive } from '../Interactive/Interactive.js'

let links = document.querySelectorAll('a.QueryLink')

function parse(href) {
  return new URLSearchParams(new URL(href).hash.slice(1))
}

for (let link of links) {
  let queryAttr = link.getAttribute('data-query')
  // Hack with innerText for not dealing with JSON beautify
  let config =
    queryAttr ||
    link.innerText.trim() ||
    link.textContent.trim().replace(/\s+/g, ' ')

  link.href = '#' + new URLSearchParams({ q: config })

  link.addEventListener('click', e => {
    e.preventDefault()
    let region = parse(link.href).get('region')

    setFormValues({ config, region })
    submitForm()
    scrollToInteractive()
  })
}

export function updateQueryLinksRegion(region) {
  for (let link of links) {
    let linkParams = parse(link.href)
    let prevRegion = linkParams.get('region')

    if (region === prevRegion) {
      return
    }

    if (region !== DEFAULT_REGION) {
      linkParams.set('region', region)
    } else {
      linkParams.delete('region')
    }

    link.setAttribute('href', '#' + linkParams)
  }
}
