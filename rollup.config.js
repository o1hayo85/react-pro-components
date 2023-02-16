import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const cwd = process.cwd();
const entries = path.join(cwd, '/packages/ui/src/index.ts')

export default {
  input: entries,
  output: [{
    file: path.join(cwd, '/packages/ui/dist/bundle.js'),
    format: "cjs",
  }, {
    file: path.join(cwd, '/packages/ui/dist/bundle.es.js'),
    format: "es",
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    }
  }],
  external: [
    'classnames',
    'react',
    'react-dom',
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ]
}