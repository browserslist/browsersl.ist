const form = document.querySelector('[data-id=query_form]')
const textarea = document.querySelector('[data-id=query_text_area]')

export function initQueryLinks() {
  let links = document.querySelectorAll('a[data-query]')
  links.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault()
      textarea.value = item.getAttribute('data-query')
      form.dispatchEvent(new Event('submit'))
    })
  })
}
