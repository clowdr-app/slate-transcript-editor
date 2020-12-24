import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
// import analyze from 'rollup-plugin-analyzer'
import { terser } from 'rollup-plugin-terser';
import esbuild from 'rollup-plugin-esbuild';
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: './src/index.js',
    output: {
      file: 'output/TranscriptEditor.js',
      format: 'es',
      plugins: [terser()],
    },
    external: ['react', 'react-dom', 'react-is'],
    plugins: [
      alias({
        entries: {
          path: require.resolve("path-browserify")
        }
      }),
      postcss({
        modules: true,
      }),
      nodeResolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      esbuild({
        loaders: {
          '.js': 'jsx',
        },
      }),
      commonjs({
        // transformMixedEsModules: true,
        include: /node_modules/,
      }),
      // analyze({summaryOnly: true})
    ],
  },
];
