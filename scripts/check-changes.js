import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

if (execSync('git status pnpm-lock.yaml -s').includes(' pnpm-lock.yaml')) {
  writeFileSync(process.env.GITHUB_OUTPUT, 'changes=1\n')
}
