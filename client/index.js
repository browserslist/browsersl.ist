import './view/base/index.js';

import fakeData from './__fixtures/query-default.json';

function updateGlobalCoverageBar(data) {
  const element = document.getElementById('global-coverage-bar');
  data.browsers.sort((a, b) => {
    return b.coverage - a.coverage;
  }).forEach((item) => {
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

updateGlobalCoverageBar(fakeData);

function createCoverageCell(coverage) {
  const coveragePercentageHtmlString = (cov) => Math.round(cov * 100) / 100 + '%';
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

  data.browsers.forEach(({name, link, icon, versions}) => {
    const tBody = document.createElement('tbody');
    const tr = document.createElement('tr');
    tr.classList.add('.BrowsersStat_tr');

    const iconCell = document.createElement('td');
    iconCell.classList.add('BrowsersStat__td');
    const iconElem = document.createElement('img');
    iconElem.classList.add('BrowsersStat__icon');
    iconElem.src = icon;
    iconCell.setAttribute('rowspan', versions.length);
    iconCell.appendChild(iconElem);
    tr.appendChild(iconCell);

    const nameCell = document.createElement('td');
    nameCell.classList.add('BrowsersStat__td');
    const nameLink = document.createElement('a');
    nameLink.classList.add('BrowsersStat__link');
    nameLink.href = link;
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

updateBrowsersStats(fakeData);
