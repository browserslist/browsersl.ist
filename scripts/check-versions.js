import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')

let tools = readFileSync(join(ROOT, '.tool-versions')).toString()
let dockerfile = readFileSync(join(ROOT, 'Dockerfile')).toString()
let packageJson = readFileSync(join(ROOT, 'package.json')).toString()

let pnpmVersion = tools.match(/pnpm ([.\d]+)/)[1]
let nodeVersion = tools.match(/nodejs ([.\d]+)/)[1]
let nodeMajor = nodeVersion.match(/^(\d+)\./)[1]

if (!dockerfile.includes(`pnpm@${pnpmVersion}`)) {
  process.stderr.write(
    'Dockerfile and .tool-versions have different pnpm version\n'
  )
  process.exit(1)
}

if (!dockerfile.includes(`FROM node:${nodeVersion}-alphine`)) {
  process.stderr.write(
    'Dockerfile and .tool-versions have different node version\n'
  )
  process.exit(1)
}

if (!packageJson.includes(`"node": ">=${nodeMajor}"`)) {
  process.stderr.write(
    'package.json and .tool-versions have different node version\n'
  )
  process.exit(1)
}
