module.exports = [
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('.'),
  {
    files: ['**/*.cjs', '**/*.js', '**/*.ts'],
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.cjs'],
          defaultProject: './tsconfig.json'
        }
      }
    }
  },
  {
    ignores: ['lib/']
  }
]
