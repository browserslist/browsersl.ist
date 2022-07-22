import http from 'http';
import browserslist from 'browserslist';
import { URL } from 'url';
import { readFileSync } from 'fs';
import { agents as caniuse } from 'caniuse-lite';

const { version: browserslistVersion } = importJSON('browserslist/package.json');
const { version: caniuseVersion } = importJSON('caniuse-lite/package.json');

const DEFAULT_QUERY = 'defaults';
const DEFAULT_REGION = 'Global';
const PORT = process.env.PORT || 5000;

let caniuseRegion;

http.createServer((req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}/`);

    if (url.pathname === '/') {
      let query = url.searchParams.get('q') || DEFAULT_QUERY;
      let region = extractRegionFromQuery(query);
      let browsers = [];

      try {
        let queryWithoutQuotes = query.replace(/'/g, '');
        browsers = browserslist(queryWithoutQuotes);
      } catch (e) {
        res.writeHead(200, { 'Content-Type': 'text/json' });
        res.write(400, JSON.stringify({ status: 'error' }));
        res.end();
      }

      let compatibleBrowsers = browsers.map((browser) => {
        let [id, version] = browser.split(' ');
        let coverage;
        let name;
        let db = caniuse[id];

        coverage = region
          ? getRegionCoverage(region, id, version)
          : getCoverage(db.usage_global, version);
        name = db.browser;

        return { id, name, version, coverage };
      });

      res.writeHead(200, { 'Content-Type': 'text/json' });
      res.write(JSON.stringify({
        query,
        region: region || DEFAULT_REGION,
        coverage: browserslist.coverage(browsers, region),
        browsers: compatibleBrowsers,
        browserslistVersion,
        caniuseVersion,
      }));
      res.end();
    }
  }).listen(PORT);

function extractRegionFromQuery(query) {
  let queryHasIn = query.match(/ in ((?:alt-)?[A-Za-z]{2})(?:,|$)/);
  return queryHasIn ? queryHasIn[1] : undefined;
}

function getCoverage(data, version) {
  let [lastVersion] = Object.keys(data).sort((a, b) => Number(b) - Number(a));

  // If specific version coverage is missing, fall back to 'version zero'
  return data[version] !== undefined
    ? data[version]
    : data[lastVersion];
}

function getRegionCoverage(region, id, version) {
  if (!caniuseRegion) {
    caniuseRegion = importJSON(`caniuse-lite/data/regions/${region}.json`);
  }

  return getCoverage(caniuseRegion.data[id], version);
}

function importJSON(filename) {
  return JSON.parse(
    readFileSync(new URL(`./node_modules/${filename}`, `${import.meta.url}`))
  );
};
