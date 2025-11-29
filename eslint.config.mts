import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Recommended base configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  
  // Global ignores
  {
    ignores: ['dist/**/*', 'node_modules/**/*']
  },
  
  // TypeScript-specific configuration
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Add your custom rules here
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
