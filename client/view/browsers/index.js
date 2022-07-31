import wikipediaLinks from '../../data/wikipedia-links.js'
import regions from '../../data/regions.js'

// TODO Put client and server to the single Docker image to use the same domain and re-use the power of HTTP/2
const API_HOST = 'http://localhost:5000/api'
const WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/'

let input = document.getElementById('browsers-input')
let select = document.getElementById('browsers-region-select')

document.addEventListener('DOMContentLoaded', async () => {
  renderResults(await getBrowsers())

  let { continentsOptgroup, countriesOptgroup } = renderRegionsOptgroups(regions);
  select.appendChild(continentsOptgroup)
  select.appendChild(countriesOptgroup)
})

input.addEventListener('input', async () => {
  // TODO debounce 100ms in printing (too much requests)
  // TODO abort previous requests
  renderResults(await getBrowsers(input.value, select.value))
})

async function getBrowsers(query = 'defaults', region = 'Global') {
  // TODO Handling errors: 400 status and connection errors
  let response = await fetch(
    `${API_HOST}/browsers?q=${encodeURIComponent(
      query
    )}&region=${encodeURIComponent(region)}`
  )
  return await response.json()
}

function renderResults({ browsers, versions: { browserslist, caniuse } }) {
  document.getElementById('browsers-root').innerHTML = `
    <ul class="browsers">
        ${browsers
          .map(
            ({ id, name, versions }) => `
          <li class="browsers__item">
            <img src="/${id}.png" alt="" />
            <a href="${getWikipediaLink(
              id
            )}" target="_blank" rel="noreferrer noopener">${name}</a>

            <ul>
                ${Object.entries(versions)
                  .sort(([, coverageA], [, coverageB]) => coverageB - coverageA)
                  .map(
                    ([version, coverage]) => `
                  <li>
                    ${version} — ${coverage}%
                  </li>`
                  )
                  .join('')}
              </ul>
          </li>
          `
          )
          .join('')}
    </ul>

    Browserslist ver: ${browserslist}
    <br />
    Data provided by caniuse-db: ${caniuse}
    `
}

function renderRegionsOptgroups({ continents, countries }) {
  let renderOption = (id, name) => {
    let option = document.createElement('option')
    option.value = id
    option.innerHTML = name
    return option
  }

  let createOptgroup = (groupName, regionsGroup) => {
    let optgroup = document.createElement('optgroup')
    optgroup.label = groupName
    for (let { id, name } of regionsGroup) {
      let option = renderOption(id, name)
      optgroup.appendChild(option)
    }
    return optgroup
  }

  return {
    continentsOptgroup: createOptgroup('Continents', continents),
    countriesOptgroup: createOptgroup('Countries',  countries)
  }
}

select.addEventListener('change', async () => {
  renderResults(await getBrowsers(input.value, select.value))
})

function getWikipediaLink(id) {
  return WIKIPEDIA_URL + wikipediaLinks[id]
}
