export function initMobileDocSections() {
  document.querySelectorAll('section.DocSection').forEach((elem) => {
    let openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.innerHTML = 'open';
    openButton.classList.add('DocSection__button');

    openButton.addEventListener('click', () => {
      elem.classList.toggle('DocSection--open');
    })

    elem.firstElementChild.insertBefore(openButton, elem.firstElementChild.firstElementChild)
  })
}
