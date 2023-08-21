import { trackEvent } from '../../lib/analytics.js'

let links = document.querySelectorAll('.Intro_supported a')

for (let link of links) {
  let event = link.innerHTML.includes('evilmartians')
    ? 'Open Evil Martians'
    : 'Open Cube'
  link.addEventListener('click', () => {
    trackEvent(event)
  })
}
