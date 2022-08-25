export function updateBar(data) {
  let element = document.querySelector('[data-id=region_coverage_bar]')
  element.innerHTML = ''
  data.forEach(item => {
    let itemElem = document.createElement('li')
    itemElem.classList.add('Bar_item')
    itemElem.style.setProperty('--proportion', item.coverage)
    itemElem.style.setProperty('--alpha', 1 - 1 / item.coverage)
    if (item.coverage > 10) {
      itemElem.innerHTML = item.name
      itemElem.classList.add('is-texted')
    } else {
      itemElem.title = item.name
    }
    element.appendChild(itemElem)
  })
}
