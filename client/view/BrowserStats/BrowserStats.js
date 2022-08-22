import wikipediaLinks from '../../data/wikipedia-links.js'
import * as browsersIcons from '../../data/browsers-logos.js'

let browserStats = document.querySelector('[data-id=browsers_stats]')

let regionCoverage = document.querySelector('[data-id=region_coverage]')
let regionCoverageCounter = document.querySelector(
  '[data-id=region_coverage_counter]'
)
let palceholder = document.querySelector('[data-id=browsers_stats_placeholder]')

function formatPercent(percent) {
  let rounded = percent < 1 ? percent : percent.toFixed(1)
  return rounded + '&thinsp;%'
}

export function updateRegionCoverageCounter(coverage) {
  regionCoverageCounter.innerHTML = formatPercent(coverage)
}

export function updateRegionCoverageBar(data) {
  let element = document.querySelector('[data-id=region_coverage_bar]')
  element.innerHTML = ''
  data.forEach(item => {
    let itemElem = document.createElement('li')
    itemElem.classList.add('BrowsersStat__regionCoverageBarItem')
    itemElem.style.setProperty('--proportion', item.coverage)
    itemElem.style.setProperty('--alpha', 1 - 1 / item.coverage)
    if (item.coverage > 10) {
      itemElem.innerHTML = item.name
      itemElem.classList.add('BrowsersStat__regionCoverageBarItem--texted')
    } else {
      itemElem.title = item.name
    }
    element.appendChild(itemElem)
  })
}

export function toggleShowStats(isShown) {
  regionCoverage.hidden = !isShown
  browserStats.hidden = !isShown
  palceholder.hidden = isShown
}

function createCoverageCell(coverage) {
  let coveragePercentageHtmlString = cov =>
    cov !== null ? formatPercent(cov) : '—'
  let coveragePercentageCssString = cov => {
    let result = (Math.log(1 + cov) * 100) / Math.log(1 + 100)
    if (result === 0) {
      return '0'
    } else if (result > 5) {
      return result + '%'
    }
    return '1px'
  }

  let coverageCell = document.createElement('td')
  coverageCell.classList.add('BrowsersStat__td')
  coverageCell.innerHTML = coveragePercentageHtmlString(coverage)
  coverageCell.classList.add('BrowsersStat__td--coverage')

  coverageCell.style.setProperty(
    '--coverage',
    coveragePercentageCssString(coverage)
  )
  return coverageCell
}

function createVersionCell(version) {
  let versionCell = document.createElement('td')
  versionCell.classList.add('BrowsersStat__td')
  versionCell.innerHTML = version
  return versionCell
}

export function updateBrowsersStats(data) {
  let element = document.querySelector('[data-id=browsers_stats_results]')

  let table = document.createElement('table')
  table.classList.add('BrowsersStat__table')

  data.forEach(({ id, name, versions: versionsInput }) => {
    let versions = Object.entries(versionsInput)
      .sort(([versionA], [versionB]) => versionB - versionA)
      .map(([version, coverage]) => {
        return {
          version,
          coverage
        }
      })

    let tBody = document.createElement('tbody')
    let tr = document.createElement('tr')
    tr.classList.add('BrowsersStat_tr')

    let iconCell = document.createElement('td')
    iconCell.classList.add('BrowsersStat__td')
    iconCell.setAttribute('rowspan', versions.length)
    tr.appendChild(iconCell)

    if (id in browsersIcons) {
      let iconElem = document.createElement('img')
      iconElem.classList.add('BrowsersStat__icon')
      iconElem.src = browsersIcons[id]
      iconElem.setAttribute('alt', '')
      iconCell.appendChild(iconElem)
    }

    let nameCell = document.createElement('td')
    nameCell.classList.add('BrowsersStat__td')
    let nameLink = document.createElement('a')
    nameLink.classList.add('Link')
    // TODO Need to take care of the case when we do not have link for some browser. Can I Use sometimes adds browsers
    nameLink.href = wikipediaLinks[id]
    nameLink.rel = 'noreferrer noopener'
    nameLink.target = '_blank'
    nameCell.setAttribute('rowspan', versions.length)
    nameLink.innerHTML = name
    nameCell.appendChild(nameLink)
    tr.appendChild(nameCell)

    tr.appendChild(createVersionCell(versions[0].version))

    tr.appendChild(createCoverageCell(versions[0].coverage))

    tBody.appendChild(tr)

    versions.slice(1).forEach(item => {
      let { version, coverage } = item
      let versionTr = document.createElement('tr')

      versionTr.appendChild(createVersionCell(version))

      versionTr.appendChild(createCoverageCell(coverage))

      tBody.appendChild(versionTr)
    })
    table.appendChild(tBody)
  })

  element.innerHTML = ''
  element.appendChild(table)
}

export function updateToolsVersions({ browserslist, caniuse }) {
  let canIUseElement = document.querySelector('[data-id=can_i_use_version]')
  canIUseElement.innerHTML = caniuse

  let browsersListElement = document.querySelector(
    '[data-id=browsers_list_version]'
  )
  browsersListElement.innerHTML = browserslist
}
