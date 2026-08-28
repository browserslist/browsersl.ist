import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')

let dockerfile = readFileSync(join(ROOT, 'Dockerfile')).toString()
let packageJson = JSON.parse(
  readFileSync(join(ROOT, 'package.json')).toString()
)

let nodeVersion = packageJson.devEngines.runtime.version

if (!dockerfile.includes(`/nodejs:${nodeVersion}`)) {
  process.stderr.write(
    'Dockerfile and package.json have different node version\n'
  )
  process.exit(1)
}
