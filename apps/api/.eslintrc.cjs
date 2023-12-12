module.exports = {
	env: {
		browser: false,
		es2021: true,
		node: true,
		jest: true
	},
	root: true,
	parserOptions: {
		tsconfigRootDir: __dirname,
		sourceType: 'module',
		project: './tsconfig.json'
	},
	extends: ['airbnb-base', 'airbnb-typescript/base', '@packages/custom'],
	rules: {
	}
};
