import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginReactJsxRuntimeConfig from 'eslint-plugin-react/configs/jsx-runtime.js';
import pluginReactHooksConfig from 'eslint-plugin-react-hooks/configs/recommended.js';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.node,
    },
    settings: {
      react: {
        version: 'detect', // React 버전을 자동으로 감지하도록 설정
      },
    },
    rules: {
      'no-console': 'warn',
    },
  },
  pluginJs.configs.recommended,
  pluginReactConfig,
  pluginReactJsxRuntimeConfig,
  pluginReactHooksConfig,
];
