import * as browsersIcons from '../../data/browsers-logos.js'
import wikipediaLinks from '../../data/wikipedia-links.js'
import { createTag, formatPercent } from '../../lib/utils.js'

let container = document.querySelector('[data-id=browsers]')
let table = document.querySelector('[data-id=browsers_table]')

export function toggleBrowsers(isShown) {
  container.hidden = !isShown
}

let coverageCss = cov => {
  let result = (Math.log(1 + cov) * 100) / Math.log(1 + 100)
  if (result === 0) {
    return '0'
  } else if (result > 5) {
    return result + '%'
  }
  return '1px'
}

function createCoverageCell(coverage) {
  let cell = createTag(
    'td',
    ['Browsers_cell', 'is-coverage'],
    coverage !== null ? formatPercent(coverage) : '—'
  )
  cell.style.setProperty('--coverage', coverageCss(coverage))
  return cell
}

function createVersionCell(version) {
  return createTag('td', ['Browsers_cell'], version)
}

function createLine(...items) {
  let tr = createTag('tr', ['Browsers_line'])
  tr.replaceChildren(...items)
  return tr
}

let parseVersion = version => {
  if (version.includes('-')) {
    let minorVersionRange = version.split('-')
    let lastMinorVersion = minorVersionRange[minorVersionRange.length - 1]
    return Number(lastMinorVersion)
  }

  return Number(version)
}

export function updateBrowsersStats(data) {
  table.replaceChildren(
    ...data.map(({ id, name, versions: versionsInput }) => {
      let versions = Object.entries(versionsInput)
        .sort(([versionA], [versionB]) => {
          // Show Safari Technology Preview at the top of the list
          if (versionA === 'TP') {
            return -1
          }

          return parseVersion(versionB) - parseVersion(versionA)
        })
        .map(([version, coverage]) => {
          return {
            coverage,
            version
          }
        })

      let iconCell = createTag('td', ['Browsers_cell'])
      iconCell.setAttribute('rowspan', versions.length)
      if (id in browsersIcons) {
        let iconElem = createTag('img', ['Browsers_icon'])
        iconElem.src = browsersIcons[id]
        iconElem.setAttribute('alt', '')
        iconCell.appendChild(iconElem)
      }

      let nameCell = createTag('td', ['Browsers_cell'])
      let nameLink = createTag('a', ['Browsers_link'])
      // TODO Need to take care of the case when we do not have link for some browser. Can I Use sometimes adds browsers
      nameLink.href = wikipediaLinks[id]
      nameLink.rel = 'noreferrer noopener'
      nameLink.target = '_blank'
      nameCell.setAttribute('rowspan', versions.length)
      nameLink.innerText = name
      nameCell.appendChild(nameLink)

      let body = createTag('tbody', ['Browsers_body'])
      body.appendChild(
        createLine(
          iconCell,
          nameCell,
          createVersionCell(versions[0].version),
          createCoverageCell(versions[0].coverage)
        )
      )
      versions.slice(1).forEach(({ coverage, version }) => {
        body.appendChild(
          createLine(createVersionCell(version), createCoverageCell(coverage))
        )
      })

      return body
    })
  )
}
