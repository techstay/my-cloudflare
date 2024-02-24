import eslint from '@eslint/js'

export default [
	eslint.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		rules: {
			semi: ['error', 'never'],
			quotes: ['error', 'single'],
			'no-unused-vars': ['warn'],
			'no-undef': ['warn']
		},
	},
]
