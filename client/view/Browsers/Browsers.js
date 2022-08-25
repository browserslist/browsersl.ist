import wikipediaLinks from '../../data/wikipedia-links.js'
import * as browsersIcons from '../../data/browsers-logos.js'

let container = document.querySelector('[data-id=browsers]')
let results = document.querySelector('[data-id=browsers_results]')

export function formatPercent(percent) {
  let rounded = percent < 1 ? percent.toFixed(2) : percent.toFixed(1)
  return rounded + ' %'
}

export function toggleShowStats(isShown) {
  container.hidden = !isShown
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
  coverageCell.innerText = coveragePercentageHtmlString(coverage)
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
  versionCell.innerText = version
  return versionCell
}

export function updateBrowsersStats(data) {
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
    nameLink.innerText = name
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

  results.replaceChildren(table)
}
