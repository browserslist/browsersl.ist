import { match } from 'node:assert'
import { readFileSync } from 'node:fs';
import test from 'node:test'

const stats = importJSON('../data/stats.json');

const COUNTER_MASK = /^\d+(\.\d+)?[KM]?$/;

test('Prebuilt stats has npm weekly downloads in `10.5K` / `70.4M` number format', () => {
  match(stats.npmDownloads, COUNTER_MASK);
})

test('Prebuilt stats has Github stars in `10.5K` / `70.4M` number format', () => {
  match(stats.githubStars, COUNTER_MASK);
})

function importJSON(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url)))
}
