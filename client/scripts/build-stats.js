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
    notation: 'compact',
    roundingMode: 'floor'
  }).format(num)
}

async function getGithubStars() {
  let githubAPI = `https://api.github.com/repos/${GITHUB_REPO}`
  let response = await fetch(githubAPI)

  if (!response.ok) {
    throw new Error(
      `GitHub API response error: ${response.status}`
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

  let npmAPI = `https://api.npmjs.org/downloads/point/${getWeekDateRange()}/${NPM_PACKAGE}`
  let response = await fetch(npmAPI)

  if (!response.ok) {
    throw new Error(
      `npm API response error: ${response.status}`
    )
  }

  let data = await response.json()
  return formatCount(data.downloads)
}
