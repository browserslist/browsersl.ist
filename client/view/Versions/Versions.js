let updated = document.querySelector('[data-id=versions_updated]')
let browserslist = document.querySelector('[data-id=versions_browserslist]')
let caniuse = document.querySelector('[data-id=versions_caniuse]')

export function updateVersions(browserslistVersion, caniuseVersion, updatedMs) {
  updated.innerText = new Date(updatedMs).toLocaleDateString('en-UK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
  browserslist.innerText = browserslistVersion
  caniuse.innerText = caniuseVersion
}
