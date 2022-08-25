export function updateVersions({ browserslist, caniuse }) {
  let canIUseElement = document.querySelector('[data-id=can_i_use_version]')
  canIUseElement.innerHTML = caniuse

  let browsersListElement = document.querySelector(
    '[data-id=browsers_list_version]'
  )
  browsersListElement.innerHTML = browserslist
}
