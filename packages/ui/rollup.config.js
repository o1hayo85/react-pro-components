import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import autoprefixer from 'autoprefixer';
import cssnanoPlugin from 'cssnano';

const generatePath = (filePath) => {
  const cwd = process.cwd();
  return path.join(cwd, filePath);
};

export default [
  {
    input: './src/index.ts',
    external: ['react', 'react-dom'],
    output: [
      {
        file: generatePath('/dist/bundle.cjs.js'),
        format: 'cjs',
      },
      {
        file: generatePath('/dist/bundle.es.js'),
        format: 'es',
      },
    ],
    plugins: [
      postcss({
        plugins: [autoprefixer, cssnanoPlugin],
        extensions: ['.css', '.less'],
        extract: generatePath('/dist/bundle.css'),
      }),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: generatePath('/tsconfig.build.json'),
      }),
      filesize(),
    ],
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: generatePath('/dist/index.d.ts'),
        format: 'es',
      },
    ],
    plugins: [
      postcss({
        plugins: [autoprefixer, cssnanoPlugin],
        extensions: ['.css', '.less'],
        extract: generatePath('/dist/bundle.css'),
      }),
      dts(),
    ],
  },
];
