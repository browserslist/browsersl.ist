import wikipediaLinks from './wikipedia-links.json'

let input = document.getElementById('browsers-input')
let select = document.getElementById('browsers-region-select')

// TODO Put client and server to the single Docker image to use the same domain and re-use the power of HTTP/2
const API_HOST = 'http://localhost:5000/api'
const WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/'

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

async function getRegions() {
  // TODO Handling errors: 400 status and connection errors
  let response = await fetch(`${API_HOST}/regions`)
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

function renderRegionsSelect(regions) {
  select.innerHTML = `
    ${Object.entries(regions).map(
      ([regionId, regionName]) =>
        `<option value="${regionId}">${regionName}</option>`
    )}
  `
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
  renderResults(await getBrowsers())
  renderRegionsSelect(await getRegions())
})

select.addEventListener('change', async () => {
  renderResults(await getBrowsers(input.value, select.value))
})

function getWikipediaLink(id) {
  return WIKIPEDIA_URL + wikipediaLinks[id]
}
