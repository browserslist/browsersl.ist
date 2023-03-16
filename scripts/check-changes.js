import { writeSync } from 'node:fs'
import { execSync } from 'node:child_process'

if (execSync('git status pnpm-lock.yaml -s').includes(' pnpm-lock.yaml')) {
  writeSync(process.env.GITHUB_OUTPUT, 'changes=1\n')
}
