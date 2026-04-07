import loguxOxlintConfig from '@logux/oxc-configs/lint'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [loguxOxlintConfig],
  rules: {
    'import/namespace': 'off',
    'typescript/no-floating-promises': 'off',
    'typescript/no-implied-eval': 'off'
  }
})
