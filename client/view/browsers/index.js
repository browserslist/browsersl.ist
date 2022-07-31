import wikipediaLinks from '../../data/wikipedia-links.js'
// TODO render regions in `<select>`
// eslint-disable-next-line no-unused-vars
import regions from '../../data/regions.js'

// TODO Put client and server to the single Docker image to use the same domain and re-use the power of HTTP/2
const API_HOST = 'http://localhost:5000/api/browsers'
const WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/'

document.getElementById('browsers-input').addEventListener('input', () => {
  let query = document.getElementById('browsers-input').value
  // TODO debounce 100ms in printing (too much requests)
  // TODO abort previous requests
  sendQuery(query)
})

sendQuery('defaults')

async function sendQuery(query) {
  // TODO Handling errors: 400 status and connection errors
  let response = await fetch(`${API_HOST}?q=${encodeURIComponent(query)}`)
  let {
    browsers,
    versions: { browserslist, caniuse }
  } = await response.json()

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

function getWikipediaLink(id) {
  return WIKIPEDIA_URL + wikipediaLinks[id]
}
