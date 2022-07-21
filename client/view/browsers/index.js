import fakeData from '../../__fixtures/query-default.json';

document.getElementById('browsers-root').innerHTML = `
  <ul class="browsers">

      ${fakeData.browsers.map(({ name, link, icon, versions }) => `
        <li class="browsers__item">
           <img src="${icon}" alt="" />
           <a href="${link}" target="_blank" rel="noreferrer noopener">${name}</a>

           <ul>
              ${versions.map(({ inQuery, version, coverage }) => `
                <li ${!inQuery ? 'style="color: gray' : ''}">
                  ${version} — ${Math.floor(coverage * 1000) / 1000}%
                </li>
              `).join("")}
            </ul>
        </li>
        `).join("")}
  </ul>

  Browserslist ver: ${fakeData.browserslistVersion}
  <br />
  Data provided by caniuse-db: ${fakeData.caniuseVersion}
`;
