module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    projectService: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  rules: {
    // 스타일 규칙은 모두 끄고, 오류 탐지 규칙만 유지
    'indent': 'off',
    'quotes': 'off',
    // ...필요 시 추가적인 룰 오버라이드
  },
};
