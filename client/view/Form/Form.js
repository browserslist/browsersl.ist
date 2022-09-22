import { DEFAULT_REGION, regionList, regionGroups } from '../../data/regions.js'
import { updateBrowsersStats, toggleBrowsers } from '../Browsers/Browsers.js'
import { debounce, formatPercent, createTag } from '../../lib/utils.js'
import { updateQueryLinksRegion } from '../QueryLink/QueryLink.js'
import { buildError, buildWarning } from '../Alert/Alert.js'
import { buildButton } from '../Button/Button.js'
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
let messages = document.querySelector('[data-id=form_messages]')
let fixButtonContainer = document.querySelector('[data-id=form_fix]')

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

  let { lint, browsers, coverage, versions } = data

  for (let { message } of lint) {
    showWarning(message)
  }

  if (lint.length > 0) {
    showFixQueryButton(lint.at(0).fixed)
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

export function showWarning(message) {
  let warning = buildWarning(messages, message)
  form.addEventListener(
    'submit',
    () => {
      warning.remove()
    },
    { once: true }
  )
}

export function showFixQueryButton(fixed) {
  let button = buildButton(fixButtonContainer)
  button.addEventListener(
    'click',
    () => {
      let urlParams = new URLSearchParams(location.hash.slice(1))
      urlParams.set('q', fixed)
      let query = urlParams.get('q')
      let region = urlParams.get('region')

      setFormValues({ query, region })
      submitForm()

      button.remove()
    },
    { once: true }
  )

  form.addEventListener(
    'submit',
    () => {
      button.remove()
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
