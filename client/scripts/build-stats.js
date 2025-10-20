import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

let GITHUB_REPO = 'browserslist/browserslist'

let ROOT = join(fileURLToPath(import.meta.url), '..', '..')
let DATA_STATS_FILE = join(ROOT, 'data/stats.json')

let githubStars

try {
  githubStars = await getGithubStars()
} catch (error) {
  throw new Error(`Error fetching stats: ${error.message}`)
}

writeFileSync(DATA_STATS_FILE, JSON.stringify({ githubStars }))

process.stdout.write(
  `A file "${DATA_STATS_FILE}" with stats has been created\n`
)

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
