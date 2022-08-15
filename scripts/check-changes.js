import { execSync } from 'node:child_process'

if (execSync('git status pnpm-lock.yaml -s').includes(' pnpm-lock.yaml')) {
  process.stdout.write('::set-output name=changes::1\n')
}
