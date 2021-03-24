import noderesolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals';
import json from 'rollup-plugin-json';

export default [{
	input: 'dist/package/index.rollup.js',
	output: {
		name: 'CCIG',
		file: 'dist/browser/cube-codes-image-generator.js',
		format: 'es',
		sourcemap: 'inline'
	},
	plugins: [
		externals({
			builtins: true
		}),
		noderesolve({
			
		}),
		commonjs(),
		json()
	],
}];