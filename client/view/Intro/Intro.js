import { trackEvent } from '../../lib/analytics.js'

let links = document.querySelectorAll('.Intro_supported a')

for (let link of links) {
  let event = link.href.includes('evilmartians')
    ? 'Open Evil Martians'
    : 'Open Cube'
  link.addEventListener('click', () => {
    trackEvent(event)
  })
}
