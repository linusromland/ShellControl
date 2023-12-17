module.exports = {
	root: true,
	parserOptions: {
		tsconfigRootDir: __dirname,
		sourceType: 'module',
		project: './tsconfig.json'
	},
	env: {
		node: true
	},
	extends: ['airbnb-base', 'airbnb-typescript/base'],
	rules: {
		'import/no-extraneous-dependencies': 'off',
		'import/prefer-default-export': 'off',
		'max-classes-per-file': 'off'
	}
};
