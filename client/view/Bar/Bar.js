let bar = document.querySelector('[data-id=bar]')

export function updateBar(data) {
  bar.replaceChildren(
    ...data.map(item => {
      let el = document.createElement('li')
      el.classList.add('Bar_item')
      el.style.setProperty('--proportion', item.coverage)
      el.style.setProperty('--alpha', 1 - 1 / item.coverage)
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
