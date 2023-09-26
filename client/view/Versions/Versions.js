let updated = document.querySelector('[data-id=versions_updated]')
let browserslist = document.querySelector('[data-id=versions_browserslist]')
let caniuse = document.querySelector('[data-id=versions_caniuse]')
let docs = document.querySelector('[data-id=versions_docs]')

export function updateVersions(browserslistVersion, caniuseVersion, updatedMs) {
  updated.innerText = new Date(updatedMs).toLocaleDateString('en-UK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
  browserslist.innerText = browserslistVersion
  caniuse.innerText = caniuseVersion
}

let hideResults = docs.innerText

function parseUrl() {
  if (location.search.includes('?results')) {
    docs.innerText = 'Show docs'
    document.body.classList.add('without-docs')
  } else {
    docs.innerText = hideResults
    document.body.classList.remove('without-docs')
  }
}

docs.addEventListener('click', () => {
  let search = location.search.includes('?results') ? '' : '?results'
  history.pushState(null, null, '/' + search + location.hash)
  parseUrl()
})

window.addEventListener('popstate', parseUrl)
parseUrl()
