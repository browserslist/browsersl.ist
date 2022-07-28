import wikipediaLinks from "./wikipedia-links.json";

const API_HOST = 'http://localhost:5000/api'
const WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/'

function init() {
  const form = document.getElementById('query_form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = await getData(formData.get('query'));
    updateBrowsersStats(data);
    updateGlobalCoverageBar(data);
  })
}

init();

async function getData(query) {
    // TODO Handling errors: 400 status and connection errors
    let response = await fetch(`${API_HOST}?q=${encodeURIComponent(query)}`)
    let {
      browsers,
      // versions: { browserslist, caniuse }
    } = await response.json();
    return browsers;
}

function updateGlobalCoverageBar(data) {
  const element = document.getElementById('global-coverage-bar');
  element.innerHTML = '';
  data.forEach((item) => {
    const alpha = 1 - 1/(item.coverage);
    const itemElem = document.createElement('li');
    itemElem.classList.add('GlobalCoverageBar__item');
    itemElem.setAttribute('style', `
    --p: ${item.coverage};
    --a: ${alpha};
    --n: '${item.coverage > 10 ? item.name : ''}';
    `)
    element.appendChild(itemElem);
  })
}

function getWikipediaLink(id) {
  return WIKIPEDIA_URL + wikipediaLinks[id]
}

function createCoverageCell(coverage) {
  const coveragePercentageHtmlString = (cov) => cov + '%';
  const coveragePercentageCssString = (cov) => {
    const result =  Math.log(1 + cov) * 100 / Math.log(1 + 100);
    if (result === 0) {
      return '0';
    } else if (result > 5) {
      return result + '%';
    }
    return '1px';
  }

  const coverageCell = document.createElement('td');
  coverageCell.classList.add('BrowsersStat__td');
  coverageCell.innerHTML = coveragePercentageHtmlString(coverage);
  coverageCell.classList.add('BrowsersStat__td--coverage');
  coverageCell.setAttribute('style', `--c:${coveragePercentageCssString(coverage)}`);
  return coverageCell;
}

function createVersionCell(version) {
  const versionCell = document.createElement('td');
  versionCell.classList.add('BrowsersStat__td');
  versionCell.innerHTML = version;
  return versionCell;
}

function updateBrowsersStats(data) {
  const element = document.getElementById('browsers-stats');

  const table = document.createElement('table');
  table.classList.add('BrowsersStat__table');

  data.forEach(({id, name, versions: versionsInput}) => {

    const versions = Object.entries(versionsInput)
      .sort(([, coverageA], [, coverageB]) => coverageB - coverageA)
      .map(([ version, coverage ]) => {
      return {
        version,
        coverage,
      }
    });

    const tBody = document.createElement('tbody');
    const tr = document.createElement('tr');
    tr.classList.add('.BrowsersStat_tr');

    const iconCell = document.createElement('td');
    iconCell.classList.add('BrowsersStat__td');
    const iconElem = document.createElement('img');
    iconElem.classList.add('BrowsersStat__icon');
    iconElem.src = `/icons${id}`;
    iconCell.setAttribute('rowspan', versions.length);
    iconCell.appendChild(iconElem);
    tr.appendChild(iconCell);

    const nameCell = document.createElement('td');
    nameCell.classList.add('BrowsersStat__td');
    const nameLink = document.createElement('a');
    nameLink.classList.add('BrowsersStat__link');
    nameLink.href = getWikipediaLink(id);
    nameLink.rel = "noreferrer noopener";
    nameCell.setAttribute('rowspan', versions.length);
    nameLink.innerHTML = name;
    nameCell.appendChild(nameLink);
    tr.appendChild(nameCell);

    tr.appendChild(createVersionCell(versions[0].version));

    tr.appendChild(createCoverageCell(versions[0].coverage));

    tBody.appendChild(tr);

    versions.slice(1).forEach((item) => {
      const {version, coverage} = item;
      const versionTr = document.createElement('tr');

      versionTr.appendChild(createVersionCell(version));

      versionTr.appendChild(createCoverageCell(coverage));

      tBody.appendChild(versionTr);
    })
    table.appendChild(tBody);
  });

  element.innerHTML = '';
  element.appendChild(table);
}

// updateBrowsersStats(fakeData);
