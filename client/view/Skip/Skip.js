let skip = document.querySelector('[data-id=skip]')
let form = document.querySelector('[data-id=query_text_area]')

skip.addEventListener('click', () => {
  form.focus()
})
