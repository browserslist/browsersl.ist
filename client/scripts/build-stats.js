import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const GITHUB_REPO = 'browserslist/browserslist'
const NPM_PACKAGE = 'browserslist'

const ROOT = join(import.meta.dirname, '..')
const DATA_STATS_FILE = join(ROOT, 'data/stats.json')

let githubStars
let npmDownloads

try {
  [githubStars, npmDownloads] = await Promise.all([
    getGithubStars(),
    getNpmDownloads()
  ])
} catch (error) {
  throw new Error(`Error fetching stats: ${error.message}`)
}

writeFileSync(DATA_STATS_FILE, JSON.stringify({ githubStars, npmDownloads }))

function formatCount(num) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    notation: 'compact',
    roundingMode: 'floor'
  }).format(num)
}

async function getGithubStars() {
  let GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}`
  let response = await fetch(GITHUB_API_URL)

  if (!response.ok) {
    throw new Error(
      `GitHub API returned status ${response.status} for ${GITHUB_API_URL}`
    )
  }

  let data = await response.json()
  return formatCount(data.stargazers_count)
}

async function getNpmDownloads() {
  let getWeekDateRange = () => {
    let formatDate = date =>
      `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
    let now = new Date()
    let weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)

    let start = formatDate(weekAgo)
    let end = formatDate(now)

    return `${start}:${end}`
  }

  let NPM_API_URL = `https://api.npmjs.org/downloads/point/${getWeekDateRange()}/${NPM_PACKAGE}`
  let response = await fetch(NPM_API_URL)

  if (!response.ok) {
    throw new Error(
      `NPM API returned status ${response.status} for ${NPM_API_URL}`
    )
  }

  let data = await response.json()
  return formatCount(data.downloads)
}
