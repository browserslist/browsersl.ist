import wikipediaLinks from "../../data/wikipedia-links.js";

const WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/'

export function updateGlobalCoverageBar(data) {
  const element = document.querySelector('[data-id=global-coverage-bar]');
  element.innerHTML = '';
  data.forEach((item) => {
    const itemElem = document.createElement('li');
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

  const statsElem = document.querySelector('.BrowsersStat__stat');
  statsElem.classList.remove('BrowsersStat__stat--hidden');

  statsPlaceholder.classList.add('BrowsersStat__placeholder--hidden');

  return true;
}

function _getWikipediaLink(id) {
  return WIKIPEDIA_URL + wikipediaLinks[id]
}

function _createCoverageCell(coverage) {
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

function _createVersionCell(version) {
  const versionCell = document.createElement('td');
  versionCell.classList.add('BrowsersStat__td');
  versionCell.innerHTML = version;
  return versionCell;
}

export function updateBrowsersStats(data) {
  const element = document.querySelector('[data-id=browsers-stats]');

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
    iconElem.src = `/assets/browser_logos/${id}.svg`;
    iconCell.setAttribute('rowspan', versions.length);
    iconElem.setAttribute('role', 'presentation');
    iconCell.appendChild(iconElem);
    tr.appendChild(iconCell);

    const nameCell = document.createElement('td');
    nameCell.classList.add('BrowsersStat__td');
    const nameLink = document.createElement('a');
    nameLink.classList.add('Link');
    nameLink.href = _getWikipediaLink(id);
    nameLink.rel = "noreferrer noopener";
    nameLink.target = "_blank";
    nameCell.setAttribute('rowspan', versions.length);
    nameLink.innerHTML = name;
    nameCell.appendChild(nameLink);
    tr.appendChild(nameCell);

    tr.appendChild(_createVersionCell(versions[0].version));

    tr.appendChild(_createCoverageCell(versions[0].coverage));

    tBody.appendChild(tr);

    versions.slice(1).forEach((item) => {
      const {version, coverage} = item;
      const versionTr = document.createElement('tr');

      versionTr.appendChild(_createVersionCell(version));

      versionTr.appendChild(_createCoverageCell(coverage));

      tBody.appendChild(versionTr);
    })
    table.appendChild(tBody);
  });

  element.innerHTML = '';
  element.appendChild(table);
}

export function updateToolsVersions({ browserslist, caniuse }) {
  const canIUseElement = document.querySelector('[data-id=can_i_use_version]');
  canIUseElement.innerHTML = caniuse;

  const browsersListElement = document.querySelector('[data-id=browsers_list_version]');
  browsersListElement.innerHTML = browserslist;
}
