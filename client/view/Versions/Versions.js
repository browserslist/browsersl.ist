let updated = document.querySelector('[data-id=versions_updated]')
let browserslist = document.querySelector('[data-id=versions_browserslist]')
let caniuse = document.querySelector('[data-id=versions_caniuse]')

export function updateVersions(
  browserslistVersion,
  caniuseVersion,
  updatedDate
) {
  updated.innerText = new Date(updatedDate).toLocaleDateString('uk')
  browserslist.innerText = browserslistVersion
  caniuse.innerText = caniuseVersion
}
