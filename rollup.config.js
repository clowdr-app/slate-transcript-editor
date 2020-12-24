import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
// import analyze from 'rollup-plugin-analyzer'
import { terser } from 'rollup-plugin-terser';
import esbuild from 'rollup-plugin-esbuild';
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';

const extensions = ['.js', '.ts', '.tsx', '.jsx'];

export default [
  {
    input: './src/index.js',
    output: {
      file: 'output/TranscriptEditor.js',
      format: 'es',
      // plugins: [terser()],
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
      // babel({
      //   extensions,
      //   exclude: /node_modules/,
      //   babelrc: false,
      //   babelHelpers: 'runtime',
      //   presets: [
      //     '@babel/preset-env',
      //     '@babel/preset-react',
      //     '@babel/preset-typescript',
      //   ],
      //   plugins: [
      //     'react-require',
      //     '@babel/plugin-syntax-dynamic-import',
      //     '@babel/plugin-proposal-class-properties',
      //     ['@babel/plugin-proposal-object-rest-spread', {
      //       useBuiltIns: true,
      //     }],
      //     ['@babel/plugin-transform-runtime', {
      //       corejs: 3,
      //       helpers: true,
      //       regenerator: true,
      //       useESModules: false,
      //     }],
      //   ],
      // }),
      // analyze({summaryOnly: true})
    ],
  },
];
