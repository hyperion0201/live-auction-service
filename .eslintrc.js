module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['standard'],
  plugins: ['babel', 'import'],
  env: {
    node: true
  },
  globals: {
    describe: true,
    test: true,
    expect: true,
    beforeEach: true
  },
  rules: {
    eqeqeq: 0,
    indent: ['error', 2],
    'no-var': 2,
    'no-console': 2,
    'no-alert': 2,
    'no-debugger': 2,
    semi: ['error', 'never'],
    'space-before-function-paren': [
      2,
      {
        anonymous: 'always',
        named: 'never'
      }
    ],
    yoda: 0,
    'arrow-parens': [0, 'always'],
    'arrow-spacing': 2,
    'brace-style': [2, 'stroustrup'],
    'padded-blocks': 0,
    'newline-after-var': 0,
    'spaced-comment': 0,
    'max-len': [2, 125, 4, {ignoreUrls: true}],
    'array-bracket-spacing': [2, 'never'],
    'computed-property-spacing': [2, 'never'],
    'no-trailing-spaces': [
      2,
      {
        skipBlankLines: true
      }
    ],
    'object-curly-spacing': [2, 'never'],
    'generator-star-spacing': 0,
    'babel/new-cap': 2,
    'import/no-unresolved': [
      2,
      {
        commonjs: true,
        amd: true
      }
    ],
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/no-named-as-default': 2,
    'import/no-commonjs': 0,
    'import/no-amd': 2,
    'import/imports-first': 2,
    'import/no-duplicates': 2,
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'] /* builtin & external are mingled */,
        pathGroups: [
          {
            pattern: '@types/**',
            group: 'external',
            position: 'after'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  },
  settings: {
    'import/resolver': {
      'babel-module': {}
    }
  }
}
