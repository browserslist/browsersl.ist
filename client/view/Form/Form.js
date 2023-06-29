import { DEFAULT_REGION, regionGroups, regionList } from '../../data/regions.js'
import { createTag, debounce, formatPercent } from '../../lib/utils.js'
import { buildError, buildWarning } from '../Alert/Alert.js'
import { updateBar } from '../Bar/Bar.js'
import { toggleBrowsers, updateBrowsersStats } from '../Browsers/Browsers.js'
import { toggleHedgehog } from '../Hedgehog/Hedgehog.js'
import { updateQueryLinksRegion } from '../QueryLink/QueryLink.js'
import { updateVersions } from '../Versions/Versions.js'
import { loadBrowsers } from './loadBrowsers.js'
import { transformConfig } from './transformConfig.js'

let form = document.querySelector('[data-id=form]')
let total = document.querySelector('[data-id=form_total]')
let formCoverage = document.querySelector('[data-id=form_coverage')
let textarea = document.querySelector('[data-id=form_textarea]')
let regionSelect = document.querySelector('[data-id=form_region]')
let messages = document.querySelector('[data-id=form_messages]')

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

export function setFormValues({ config, region }) {
  textarea.value = config

  if (!region) region = 'alt-ww'
  let isRegionExists = regionList.includes(region)
  if (region && isRegionExists) {
    regionSelect.value = region
  }
}

export function submitForm() {
  form.dispatchEvent(new Event('submit', { cancelable: true }))
}

let prev = ''
async function updateStatsView(config, region) {
  if (config.length === 0) {
    formCoverage.hidden = true
    toggleBrowsers(false)
    toggleHedgehog(true)
    return
  }

  if (prev === config + region) return
  prev = config + region

  form.classList.add('is-loading')
  let data
  try {
    data = await loadBrowsers(config, region)
  } catch (e) {
    if (e.name === 'ServerError') {
      showError(e.message, textarea)
    } else {
      throw e
    }
  } finally {
    form.classList.remove('is-loading')
  }

  if (!data) {
    return
  }

  let { browsers, coverage, lint, updated, versions } = data

  for (let { fixed, message } of lint) {
    showWarning(message, fixed)
  }

  formCoverage.hidden = false
  toggleBrowsers(true)
  toggleHedgehog(false)
  updateBrowsersStats(browsers)
  total.innerText = formatPercent(coverage)
  updateBar(browsers)
  updateVersions(versions.browserslist, versions.caniuse, updated)
}

function changeUrl(config, region) {
  let urlParams = new URLSearchParams()
  if (config) {
    urlParams.set('q', config)
  }

  if (region && region !== DEFAULT_REGION) {
    urlParams.set('region', region)
  }

  location.hash = '#' + urlParams
}

function submitFormWithUrlParams() {
  let urlParams = new URLSearchParams(location.hash.slice(1))

  let config = urlParams.get('q')
  let region = urlParams.get('region')

  setFormValues({ config, region })
  submitForm()
}

export function focusForm() {
  textarea.focus()
}

export function showError(message) {
  let error = buildError(messages, message)
  textarea.setAttribute('aria-errormessage', 'form_error')
  textarea.setAttribute('aria-invalid', 'true')
  form.addEventListener(
    'submit',
    () => {
      textarea.removeAttribute('aria-errormessage')
      textarea.removeAttribute('aria-invalid')
      error.remove()
    },
    { once: true }
  )
}

export function showWarning(message, fixed) {
  let { fix, warning } = buildWarning(messages, message, fixed)
  form.addEventListener(
    'submit',
    () => {
      warning.remove()
      fix.remove()
    },
    { once: true }
  )
}

regionSelect.appendChild(createOptgroup('Continents', regionGroups.continents))
regionSelect.appendChild(createOptgroup('Countries', regionGroups.countries))

regionSelect.addEventListener('change', () => {
  submitForm()
})

form.addEventListener('submit', e => {
  e.preventDefault()

  let formData = new FormData(form)
  let config = transformConfig(formData.get('config'))
  let region = formData.get('region')

  changeUrl(config, region)
  updateStatsView(config, region)
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
