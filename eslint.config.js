import loguxConfig from '@logux/eslint-config'
import globals from 'globals'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { ignores: ['client/dist/'] },
  ...loguxConfig,
  {
    files: ['client/**/*.js'],
    languageOptions: {
      globals: globals.browser
    }
  }
]
