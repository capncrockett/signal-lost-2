module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // Note: The following line is commented out as the plugin is not yet installed
    // 'plugin:jsdoc/recommended'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    // Note: The following line is commented out as the plugin is not yet installed
    // 'jsdoc'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-explicit-any': 0,

    // JSDoc rules (commented out until the plugin is installed)
    // 'jsdoc/require-jsdoc': ['warn', {
    //   'publicOnly': true,
    //   'require': {
    //     'FunctionDeclaration': true,
    //     'MethodDefinition': true,
    //     'ClassDeclaration': true,
    //     'ArrowFunctionExpression': false,
    //     'FunctionExpression': false
    //   }
    // }],
    // 'jsdoc/require-param': 'warn',
    // 'jsdoc/require-param-description': 'warn',
    // 'jsdoc/require-param-name': 'warn',
    // 'jsdoc/require-param-type': 'off', // TypeScript handles types
    // 'jsdoc/require-returns': 'warn',
    // 'jsdoc/require-returns-description': 'warn',
    // 'jsdoc/require-returns-type': 'off', // TypeScript handles types
    // 'jsdoc/valid-jsdoc': 'warn'
  },
}
