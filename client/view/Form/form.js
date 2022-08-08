import {
  updateBrowsersStats,
  updateRegionCoverageHeader,
  updateRegionCoverageBar,
  updateToolsVersions,
  hideStatsPlaceholder
} from '../BrowserStats/browserStats.js'
import regionsList from '../../data/regions.js'

const API_HOST = 'http://localhost:5000/api/'

const form = document.querySelector('[data-id=query_form]')
const textarea = document.querySelector('[data-id=query_text_area]')
const regionSelect = document.querySelector('[data-id=region_select]')
const errorMessage = document.querySelector('[data-id=error_message]')

export function initForm() {
  renderRegionSelectOptions()

  form.addEventListener('submit', async e => {
    if (!form.checkValidity()) {
      return
    }
    let formData = new FormData(form)
    let query = formData.get('query')
    let region = formData.get('region')
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
  })

  textarea.addEventListener('keypress', e => {
    if (e.keyCode === 13 && !e.shiftKey) {
      submitForm()
    }
  })

  regionSelect.addEventListener('change', submitForm)
}

function submitForm() {
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

  let { continentsOptgroup, countriesOptgroup } = renderOptgroups(regionsList)
  regionSelect.appendChild(continentsOptgroup)
  regionSelect.appendChild(countriesOptgroup)
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
    let urlParams = new URLSearchParams({ q: query, region })
    let url = new URL(`browsers?${urlParams}`, `${API_HOST}`)
    response = await fetch(url)
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

  let { browsers, coverage, versions } = data

  hideStatsPlaceholder()
  updateBrowsersStats(browsers)
  updateRegionCoverageHeader(coverage)
  updateRegionCoverageBar(browsers)
  updateToolsVersions(versions)

  return true
}
