import {
  updateBrowsersStats,
  updateRegionCoverageCounter,
  updateRegionCoverageBar,
  updateToolsVersions,
  showStats
} from '../BrowserStats/browserStats.js'
import regionsList from '../../data/regions.js'

const API_HOST = 'http://localhost:5000/api/'

const form = document.querySelector('[data-id=query_form]')
const textarea = document.querySelector('[data-id=query_text_area]')
const regionCoverage = document.querySelector('[data-id=region_coverage]')
const regionCoverageSelect = document.querySelector(
  '[data-id=region_coverage_select]'
)
const errorMessage = document.querySelector('[data-id=error_message]')

form.addEventListener('submit', handleFormSubmit)

textarea.addEventListener('keypress', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submitForm()
  }
})

renderRegionSelectOptions()

regionCoverageSelect.addEventListener('change', () => {
  submitForm()
})

submitFormWithUrlParams()

window.addEventListener('popstate', () => {
  submitFormWithUrlParams()
})

async function handleFormSubmit(e) {
  if (!form.checkValidity()) {
    return
  }

  let formData = new FormData(form)
  let query = formData.get('query')
  let region = formData.get('region')

  changeUrl(query, region)

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
  updateStatsView(query, region)
}

export function setFormValues({ query, region }) {
  if (query) {
    textarea.value = query
    form.classList.remove('Form--serverError')
  }

  if (region) {
    regionCoverageSelect.value = region
  }
}

export function submitForm() {
  form.dispatchEvent(new Event('submit', { cancelable: true }))
}

function showCoverageControls() {
  regionCoverage.classList.remove('Form__coverage--hidden')
}

function renderRegionSelectOptions() {
  let renderOptgroups = ({ continents, countries }) => {
    let renderOption = (id, name) => {
      let option = document.createElement('option')
      option.value = id
      option.innerHTML = name
      return option
    }

    let renderOptgroup = (groupName, regionsGroup) => {
      let optgroup = document.createElement('optgroup')
      optgroup.label = groupName
      for (let { id, name } of regionsGroup) {
        let option = renderOption(id, name)
        optgroup.appendChild(option)
      }
      return optgroup
    }

    return {
      continentsOptgroup: renderOptgroup('Continents', continents),
      countriesOptgroup: renderOptgroup('Countries', countries)
    }
  }

  let { continentsOptgroup, countriesOptgroup } = renderOptgroups(regionsList)
  regionCoverageSelect.appendChild(continentsOptgroup)
  regionCoverageSelect.appendChild(countriesOptgroup)
}

function renderError(message) {
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

async function updateStatsView(query, region) {
  let response
  try {
    form.classList.add('Form--loaded')
    let urlParams = new URLSearchParams({ q: query, region })
    let url = new URL(`browsers?${urlParams}`, `${API_HOST}`)
    response = await fetch(url)
  } catch (error) {
    renderError(`Network error. Check that you are online.`)
    form.classList.remove('Form--loaded')
    return false
  }

  let data = await response.json()

  form.classList.remove('Form--loaded')

  if (!response.ok) {
    if (data.message === 'Custom usage statistics was not provided') {
      renderError(`This website does not support in my stats queries yet. Run Browserslist
 <a href="https://github.com/browserslist/browserslist#custom-usage-data" class="Link">locally</a>.`)
      return false
    }
    if (response.status === 500) {
      renderError(`Server error. <a href="https://github.com/browserslist/browserl.ist" class="Link">
Report an issue</a> to our repository.`)
      return false
    }
    renderError(data.message)
    return false
  }

  let { browsers, coverage, versions } = data

  showCoverageControls()
  showStats()
  updateBrowsersStats(browsers)
  updateRegionCoverageCounter(coverage)
  updateRegionCoverageBar(browsers)
  updateToolsVersions(versions)

  return true
}

function changeUrl(query, region) {
  let urlParams = new URLSearchParams()
  if (query) {
    urlParams.set('q', query)
  }

  if (region) {
    urlParams.set('region', region)
  }

  window.history.pushState({}, query, '?' + urlParams)
}

function submitFormWithUrlParams() {
  let urlParams = new URLSearchParams(window.location.search)

  let query = urlParams.get('q')
  let region = urlParams.get('region')

  if (!query) return

  setFormValues({ query, region })
  submitForm()
}
