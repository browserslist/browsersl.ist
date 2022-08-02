const form = document.getElementById('query_form');
const textarea = document.getElementById('query_text_area');

export function initQueryLinks() {
  const links = document.querySelectorAll('a[data-query]');
  links.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      textarea.value = item.getAttribute('data-query');
      form.dispatchEvent(new Event('submit'));
    })
  })
}
