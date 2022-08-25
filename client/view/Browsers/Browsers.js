import wikipediaLinks from '../../data/wikipedia-links.js'
import * as browsersIcons from '../../data/browsers-logos.js'

let browserStats = document.querySelector('[data-id=browsers_stats]')

let regionCoverage = document.querySelector('[data-id=region_coverage]')
let regionCoverageCounter = document.querySelector(
  '[data-id=region_coverage_counter]'
)
let placeholder = document.querySelector('[data-id=browsers_stats_placeholder]')

function formatPercent(percent) {
  let rounded = percent < 1 ? percent.toFixed(2) : percent.toFixed(1)
  return rounded + '&thinsp;%'
}

export function updateRegionCoverageCounter(coverage) {
  regionCoverageCounter.innerHTML = formatPercent(coverage)
}

export function toggleShowStats(isShown) {
  regionCoverage.hidden = !isShown
  browserStats.hidden = !isShown
  placeholder.hidden = isShown
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
  coverageCell.classList.add('Browsers_cell')
  coverageCell.innerHTML = coveragePercentageHtmlString(coverage)
  coverageCell.classList.add('is-coverage')

  coverageCell.style.setProperty(
    '--coverage',
    coveragePercentageCssString(coverage)
  )
  return coverageCell
}

function createVersionCell(version) {
  let versionCell = document.createElement('td')
  versionCell.classList.add('Browsers_cell')
  versionCell.innerHTML = version
  return versionCell
}

export function updateBrowsersStats(data) {
  let element = document.querySelector('[data-id=browsers_stats_results]')

  let table = document.createElement('table')
  table.classList.add('Browsers_table')

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
    tBody.classList.add('Browsers_body')
    let tr = document.createElement('tr')
    tr.classList.add('Browsers_line')

    let iconCell = document.createElement('td')
    iconCell.classList.add('Browsers_cell')
    iconCell.setAttribute('rowspan', versions.length)
    tr.appendChild(iconCell)

    if (id in browsersIcons) {
      let iconElem = document.createElement('img')
      iconElem.classList.add('Browsers_icon')
      iconElem.src = browsersIcons[id]
      iconElem.setAttribute('alt', '')
      iconCell.appendChild(iconElem)
    }

    let nameCell = document.createElement('td')
    nameCell.classList.add('Browsers_cell')
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
      versionTr.classList.add('Browsers_line')

      versionTr.appendChild(createVersionCell(version))

      versionTr.appendChild(createCoverageCell(coverage))

      tBody.appendChild(versionTr)
    })
    table.appendChild(tBody)
  })

  element.innerHTML = ''
  element.appendChild(table)
}
