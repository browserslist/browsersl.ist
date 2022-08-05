import wikipediaLinks from "../../data/wikipedia-links.js";

const WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/'

export function updateGlobalCoverageBar(data) {
  let element = document.querySelector('[data-id=global-coverage-bar]');
  element.innerHTML = '';
  data.forEach((item) => {
    let itemElem = document.createElement('li');
    itemElem.classList.add('BrowsersStat__globalCoverageBarItem');
    itemElem.style.setProperty('--proportion', item.coverage)
    itemElem.style.setProperty('--alpha',  1 - 1/(item.coverage))
    if(item.coverage > 10) {
      itemElem.innerHTML = item.name;
      itemElem.classList.add('BrowsersStat__globalCoverageBarItem--texted')
    }
    element.appendChild(itemElem);
  })
}

const statsPlaceholder = document.querySelector('.BrowsersStat__placeholder');

export function hideStatsPlaceholder() {
  if(statsPlaceholder.classList.contains('BrowsersStat__placeholder--hidden')) {
    return true;
  }

  let statsElem = document.querySelector('.BrowsersStat__stat');
  statsElem.classList.remove('BrowsersStat__stat--hidden');

  statsPlaceholder.classList.add('BrowsersStat__placeholder--hidden');

  return true;
}

function getWikipediaLink(id) {
  return WIKIPEDIA_URL + wikipediaLinks[id]
}

function createCoverageCell(coverage) {
  let coveragePercentageHtmlString = (cov) => cov + '%';
  let coveragePercentageCssString = (cov) => {
    let result =  Math.log(1 + cov) * 100 / Math.log(1 + 100);
    if (result === 0) {
      return '0';
    } else if (result > 5) {
      return result + '%';
    }
    return '1px';
  }

  let coverageCell = document.createElement('td');
  coverageCell.classList.add('BrowsersStat__td');
  coverageCell.innerHTML = coveragePercentageHtmlString(coverage);
  coverageCell.classList.add('BrowsersStat__td--coverage');


  coverageCell.style.setProperty('--coverage',  coveragePercentageCssString(coverage));
  return coverageCell;
}

function createVersionCell(version) {
  let versionCell = document.createElement('td');
  versionCell.classList.add('BrowsersStat__td');
  versionCell.innerHTML = version;
  return versionCell;
}

export function updateBrowsersStats(data) {
  let element = document.querySelector('[data-id=browsers-stats]');

  let table = document.createElement('table');
  table.classList.add('BrowsersStat__table');

  data.forEach(({id, name, versions: versionsInput}) => {

    let versions = Object.entries(versionsInput)
      .sort(([, coverageA], [, coverageB]) => coverageB - coverageA)
      .map(([ version, coverage ]) => {
        return {
          version,
          coverage,
        }
      });

    let tBody = document.createElement('tbody');
    let tr = document.createElement('tr');
    tr.classList.add('.BrowsersStat_tr');

    let iconCell = document.createElement('td');
    iconCell.classList.add('BrowsersStat__td');
    let iconElem = document.createElement('img');
    iconElem.classList.add('BrowsersStat__icon');
    iconElem.src = `/assets/browser_logos/${id}.svg`;
    iconCell.setAttribute('rowspan', versions.length);
    iconElem.setAttribute('role', 'presentation');
    iconCell.appendChild(iconElem);
    tr.appendChild(iconCell);

    let nameCell = document.createElement('td');
    nameCell.classList.add('BrowsersStat__td');
    let nameLink = document.createElement('a');
    nameLink.classList.add('Link');
    nameLink.href = getWikipediaLink(id);
    nameLink.rel = "noreferrer noopener";
    nameLink.target = "_blank";
    nameCell.setAttribute('rowspan', versions.length);
    nameLink.innerHTML = name;
    nameCell.appendChild(nameLink);
    tr.appendChild(nameCell);

    tr.appendChild(createVersionCell(versions[0].version));

    tr.appendChild(createCoverageCell(versions[0].coverage));

    tBody.appendChild(tr);

    versions.slice(1).forEach((item) => {
      let {version, coverage} = item;
      let versionTr = document.createElement('tr');

      versionTr.appendChild(createVersionCell(version));

      versionTr.appendChild(createCoverageCell(coverage));

      tBody.appendChild(versionTr);
    })
    table.appendChild(tBody);
  });

  element.innerHTML = '';
  element.appendChild(table);
}

export function updateToolsVersions({ browserslist, caniuse }) {
  let canIUseElement = document.querySelector('[data-id=can_i_use_version]');
  canIUseElement.innerHTML = caniuse;

  let browsersListElement = document.querySelector('[data-id=browsers_list_version]');
  browsersListElement.innerHTML = browserslist;
}
