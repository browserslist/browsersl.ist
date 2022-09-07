import { DEFAULT_REGION, regionList, regionGroups } from '../../data/regions.js'
import { updateBrowsersStats, toggleBrowsers } from '../Browsers/Browsers.js'
import { debounce, formatPercent, createTag } from '../../lib/utils.js'
import { updateQueryLinksRegion } from '../QueryLink/QueryLink.js'
import { toggleHedgehog } from '../Hedgehog/Hedgehog.js'
import { updateVersions } from '../Versions/Versions.js'
import { transformQuery } from './transformQuery.js'
import { loadBrowsers } from './loadBrowsers.js'
import { updateBar } from '../Bar/Bar.js'

let form = document.querySelector('[data-id=form]')
let total = document.querySelector('[data-id=form_total]')
let formCoverage = document.querySelector('[data-id=form_coverage')
let textarea = document.querySelector('[data-id=form_textarea]')
let regionSelect = document.querySelector('[data-id=form_region]')
let errorMessage = document.querySelector('[data-id=form_error]')
let warningMessage = document.querySelector('[data-id=form_warning]')

function createOptgroup(groupName, regionsGroup) {
  let optgroup = createTag('optgroup')
  optgroup.label = groupName
  optgroup.replaceChildren(
    ...regionsGroup.map(({ id, name }) => {
      let option = createTag('option', [], name)
      option.value = id
      return option
    })
  )
  return optgroup
}

export function setFormValues({ query, region }) {
  textarea.value = query

  if (!region) region = 'alt-ww'
  let isRegionExists = regionList.includes(region)
  if (region && isRegionExists) {
    regionSelect.value = region
  }
}

export function submitForm() {
  form.dispatchEvent(new Event('submit', { cancelable: true }))
}

function onNextChange(cb) {
  form.addEventListener('submit', cb, { once: true })
}

function renderError(message) {
  errorMessage.innerHTML = message
  errorMessage.hidden = false
  textarea.setAttribute('aria-errormessage', 'form_error')
  textarea.setAttribute('aria-invalid', 'true')
  onNextChange(() => {
    textarea.removeAttribute('aria-errormessage')
    textarea.removeAttribute('aria-invalid')
    errorMessage.innerHTML = ''
    errorMessage.hidden = true
  })
}

function renderWarning(message) {
  warningMessage.innerHTML = message
  warningMessage.hidden = false
  onNextChange(() => {
    warningMessage.innerHTML = ''
    warningMessage.hidden = true
  })
}

let formatHintText = text =>
  `<p>${text.replace(/`([^`]+)`/g, '<strong>$1</strong>')}</p>`

let prev = ''
async function updateStatsView(query, region) {
  if (query.length === 0) {
    formCoverage.hidden = true
    toggleBrowsers(false)
    toggleHedgehog(true)
    return
  }

  if (prev === query + region) return
  prev = query + region

  form.classList.add('is-loading')
  let data
  try {
    data = await loadBrowsers(query, region)
  } catch (e) {
    if (e.name === 'ServerError') {
      renderError(formatHintText(e.message))
    } else {
      throw e
    }
  } finally {
    form.classList.remove('is-loading')
  }

  if (!data) {
    return
  }

  let { lint, browsers, coverage, versions } = data

  if (lint.length > 0) {
    let linterWarning = lint
      .map(({ message }) => formatHintText(message + '.'))
      .join('')
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

  location.hash = '#' + urlParams
}

function submitFormWithUrlParams() {
  let urlParams = new URLSearchParams(location.hash.slice(1))

  let query = urlParams.get('q')
  let region = urlParams.get('region')

  setFormValues({ query, region })
  submitForm()
}

export function focusForm() {
  textarea.focus()
}

regionSelect.appendChild(createOptgroup('Continents', regionGroups.continents))
regionSelect.appendChild(createOptgroup('Countries', regionGroups.countries))

regionSelect.addEventListener('change', () => {
  submitForm()
})

form.addEventListener('submit', e => {
  e.preventDefault()

  let formData = new FormData(form)
  let query = transformQuery(formData.get('query'))
  let region = formData.get('region')

  changeUrl(query, region)
  updateStatsView(query, region)
  updateQueryLinksRegion(region)
})

let submitFormDebounced = debounce(submitForm, 300)

textarea.addEventListener('input', () => {
  submitFormDebounced()
})

submitFormWithUrlParams()
window.addEventListener('hashchange', () => {
  submitFormWithUrlParams()
})
