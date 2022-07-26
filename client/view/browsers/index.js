// TODO Add variables to .env
const API_HOST = 'http://localhost:5000'
const WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/'

document.getElementById('browsers-input').addEventListener('input', () => {
  let query = document.getElementById('browsers-input').value
  sendQuery(query)
})

sendQuery('defaults')

async function sendQuery(query) {
  let response = await fetch(`${API_HOST}/?q=${encodeURIComponent(query)}`)
  let { browsers, cv, bv } = await response.json()

  document.getElementById('browsers-root').innerHTML = `
    <ul class="browsers">
        ${browsers
          .map(
            ({ id, name, wiki, versions }) => `
          <li class="browsers__item">
            <img src="/${id}.png" alt="" />
            <a href="${WIKIPEDIA_URL}${wiki}" target="_blank" rel="noreferrer noopener">${name}</a>

            <ul>
                ${versions
                  .map(
                    ([version, coverage]) => `
                  <li>
                    ${version} — ${Math.floor(coverage * 1000) / 1000}%
                  </li>
                `
                  )
                  .join('')}
              </ul>
          </li>
          `
          )
          .join('')}
    </ul>

    Browserslist ver: ${bv}
    <br />
    Data provided by caniuse-db: ${cv}
    `
}
