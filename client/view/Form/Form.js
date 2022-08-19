import { DEFAULT_REGION, regionList, regionGroups } from '../../data/regions.js'
import {
  updateBrowsersStats,
  updateRegionCoverageCounter,
  updateRegionCoverageBar,
  updateToolsVersions,
  toggleShowStats
} from '../BrowserStats/BrowserStats.js'
import transformQuery from './transformQuery.js'

let form = document.querySelector('[data-id=query_form]')
let textarea = document.querySelector('[data-id=query_text_area]')
let regionCoverageSelect = document.querySelector(
  '[data-id=region_coverage_select]'
)
let errorMessage = document.querySelector('[data-id=error_message]')

form.addEventListener('submit', handleFormSubmit)

let submitFormDebounced = debounce(submitForm, 300)

textarea.addEventListener('input', () => {
  submitFormDebounced()
})

renderRegionSelectOptions()

regionCoverageSelect.addEventListener('change', () => {
  submitForm()
})

submitFormWithUrlParams()

window.addEventListener('popstate', () => {
  submitFormWithUrlParams()
})

function handleFormSubmit(e) {
  e.preventDefault()

  let formData = new FormData(form)
  let query = transformQuery(formData.get('query'))
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

  let isRegionExists = regionList.includes(region)

  if (region && isRegionExists) {
    regionCoverageSelect.value = region
  }
}

export function submitForm() {
  form.dispatchEvent(new Event('submit', { cancelable: true }))
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

  let { continentsOptgroup, countriesOptgroup } = renderOptgroups(regionGroups)
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

  if (query.length === 0) {
    toggleShowStats(false)
    return false
  }

  try {
    form.classList.add('Form--loaded')
    let urlParams = new URLSearchParams({
      q: query,
      region
    })
    response = await fetch(`/api/browsers?${urlParams}`)
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

  toggleShowStats(true)
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

  if (region && region !== DEFAULT_REGION) {
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

function debounce(callback, delay) {
  let timeout
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(callback, delay)
  }
}
