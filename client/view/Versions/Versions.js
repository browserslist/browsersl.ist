let browserslist = document.querySelector('[data-id=versions_browserslist]')
let caniuse = document.querySelector('[data-id=versions_caniuse]')

export function updateVersions(browserslistVersion, caniuseVersion) {
  browserslist.innerText = browserslistVersion
  caniuse.innerText = caniuseVersion
}
