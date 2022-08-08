import {
  updateBrowsersStats,
  updateGlobalCoverageBar,
  updateToolsVersions,
  hideStatsPlaceholder
} from '../BrowserStats/browserStats.js'

const API_HOST = 'http://localhost:5000/api'

const form = document.querySelector('[data-id=query_form]')
const textarea = document.querySelector('[data-id=query_text_area]')
const errorMessage = document.querySelector('[data-id=error_message]')

export function initForm() {
  form.addEventListener('submit', async e => {
    if (!form.checkValidity()) {
      return
    }

    let formData = new FormData(form)
    let query = formData.get('query')
    changeUrl(query);
    e.preventDefault()
    form.classList.add('Form--justSend')
    textarea.addEventListener(
      'input',
      () => {
        form.classList.remove('Form--justSend')
      },
      {
        once: true
      }
    )
    updateStatsView(query)
  })
  textarea.addEventListener('keypress', e => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
      submitForm()
    }
  })

  initUrlControl()
}

export function renderError(message) {
  errorMessage.innerHTML = message
  form.classList.add('Form--serverError')
  textarea.addEventListener(
    'input',
    () => {
      form.classList.remove('Form--serverError')
    },
    {
      once: true
    }
  )
}

async function updateStatsView(query) {
  let response
  try {
    response = await fetch(
      `${API_HOST}/browsers?q=${encodeURIComponent(query)}`
    )
    // TODO add loader
  } catch (error) {
    // TODO handle error
    return false
  }

  let data = await response.json()

  if (!response.ok) {
    if (data.message === 'Custom usage statistics was not provided') {
      renderError(`This website does not support in my stats queries yet. Run Browserslist
 <a href="https://github.com/browserslist/browserslist#custom-usage-data" class="Link">locally</a>.`)
      return false
    }
    renderError(data.message)
    return false
  }

  let { browsers, versions } = data

  hideStatsPlaceholder()
  updateBrowsersStats(browsers)
  updateGlobalCoverageBar(browsers)
  updateToolsVersions(versions)

  return true
}

export function submitForm(query) {
  if (query) {
    textarea.value = query
  }

  form.dispatchEvent(new Event('submit', { cancelable: true }));
}

function initUrlControl() {
  let urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get('query')) {
    submitForm(urlParams.get('query'));
  }
}

function changeUrl(query) {
  window.history.pushState({}, query, `?query=${query}`)
}
