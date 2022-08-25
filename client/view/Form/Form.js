import { DEFAULT_REGION, regionList, regionGroups } from '../../data/regions.js'
import { updateBrowsersStats, toggleBrowsers } from '../Browsers/Browsers.js'
import { toggleHedgehog } from '../Hedgehog/Hedgehog.js'
import transformQuery from './transformQuery.js'
import loadBrowsersData from './loadBrowsersData.js'
import { updateBar } from '../Bar/Bar.js'
import { updateVersions } from '../Versions/Versions.js'
import { debounce, formatPercent } from '../../lib/utils.js'

let form = document.querySelector('[data-id=form]')
let total = document.querySelector('[data-id=form_total]')
let formCoverage = document.querySelector('[data-id=form_coverage')
let textarea = document.querySelector('[data-id=form_textarea]')
let regionSelect = document.querySelector('[data-id=form_region]')
let errorMessage = document.querySelector('[data-id=form_error]')
let warningMessage = document.querySelector('[data-id=form_warning]')

form.addEventListener('submit', handleFormSubmit)

let submitFormDebounced = debounce(submitForm, 300)

textarea.addEventListener('input', () => {
  submitFormDebounced()
})

renderRegionSelectOptions()

regionSelect.addEventListener('change', () => {
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
  updateStatsView(query, region)
}

export function setFormValues({ query, region }) {
  if (query) {
    textarea.value = query
    form.classList.remove('is-error')
    form.classList.remove('is-warning')
  }

  let isRegionExists = regionList.includes(region)

  if (region && isRegionExists) {
    regionSelect.value = region
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
      option.innerText = name
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
  regionSelect.appendChild(continentsOptgroup)
  regionSelect.appendChild(countriesOptgroup)
}

function renderError(message) {
  errorMessage.innerHTML = message
  form.classList.add('is-error')
  textarea.setAttribute('aria-errormessage', 'form_error')
  textarea.setAttribute('aria-invalid', 'true')
  textarea.addEventListener(
    'input',
    () => {
      textarea.removeAttribute('aria-errormessage')
      textarea.removeAttribute('aria-invalid')
      errorMessage.innerHTML = ''
      form.classList.remove('is-error')
    },
    {
      once: true
    }
  )
}

function renderWarning(message) {
  warningMessage.innerHTML = message
  form.classList.add('is-warning')
  textarea.addEventListener(
    'input',
    () => {
      warningMessage.innerHTML = ''
      form.classList.remove('is-warning')
    },
    { once: true }
  )
}

async function updateStatsView(query, region) {
  if (query.length === 0) {
    formCoverage.hidden = true
    toggleBrowsers(false)
    toggleHedgehog(true)
    return
  }

  let data
  let error

  form.classList.add('is-loading')

  try {
    data = await loadBrowsersData(query, region)
  } catch (e) {
    error = e
  }

  form.classList.remove('is-loading')

  if (error) {
    renderError(error.message)
    return
  }

  if (!data) {
    return
  }

  let { lint, browsers, coverage, versions } = data

  if (lint.length > 0) {
    let linterWarning = lint
      .map(({ message }) =>
        message.replace(/`([^`]+)`/g, '<strong>$1</strong>')
      )
      .join('.<br />')
    renderWarning(linterWarning)
  }

  formCoverage.hidden = false
  toggleBrowsers(true)
  toggleHedgehog(false)
  updateBrowsersStats(browsers)
  total.innerText = formatPercent(coverage)
  updateBar(browsers)
  updateVersions(versions.browserslist, versions.caniuse)
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

export function focusForm() {
  textarea.focus()
}
