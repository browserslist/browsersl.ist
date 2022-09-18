import { createTag } from '../../lib/utils.js'

let bar = document.querySelector('[data-id=bar]')

export function updateBar(data) {
  bar.replaceChildren(
    ...data.map(item => {
      let alpha = (100 - 100 / item.coverage) / 100
      if (alpha < 0.3) alpha = 0.3
      let el = createTag('li', ['Bar_item'])
      el.style.setProperty('--proportion', item.coverage)
      el.style.setProperty('--alpha', alpha)
      if (item.coverage > 10) {
        el.innerText = item.name
        el.classList.add('is-texted')
      } else {
        el.title = item.name
      }
      return el
    })
  )
}
