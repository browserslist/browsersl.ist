import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')

let nodeVersion = readFileSync(join(ROOT, '.node-version')).toString().trim()
let dockerfile = readFileSync(join(ROOT, 'Dockerfile')).toString()
let packageJson = readFileSync(join(ROOT, 'package.json')).toString()

let pnpmVersion = packageJson.match(/pnpm@([.\d]+)/)[1]
let nodeMajor = nodeVersion.match(/^(\d+)\./)[1]

if (!dockerfile.includes(`PNPM_VERSION ${pnpmVersion}`)) {
  process.stderr.write(
    'Dockerfile and package.json have different pnpm version\n'
  )
  process.exit(1)
}

if (!dockerfile.includes(`NODE_VERSION ${nodeVersion}`)) {
  process.stderr.write(
    'Dockerfile and .node-version have different node version\n'
  )
  process.exit(1)
}

if (!packageJson.includes(`"node": ">=${nodeMajor}"`)) {
  process.stderr.write(
    'package.json and .tool-versions have different node version\n'
  )
  process.exit(1)
}
