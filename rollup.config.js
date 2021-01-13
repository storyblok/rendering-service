import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import browsersync from 'rollup-plugin-browsersync'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'
import commonjs from 'rollup-plugin-commonjs'

import simplevars from 'postcss-simple-vars'
import nested from 'postcss-nested'
import cssnext from 'postcss-cssnext'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import postcssFunctions from 'postcss-functions'
import { fromString, fromRgb, fromRgba } from 'css-color-converter'

import config from './config.json'
const production = !process.env.ROLLUP_WATCH;

const customPostCSSFunctions = {
  functions: {
    rem16(pixels) {
      return Math.round((pixels / 16 + Number.EPSILON) * 1000) / 1000 + 'rem'
    }
  }
}

const postCSSOptions = {
  extract: true,
  extensions: ['.css'],
  plugins: [
    postcssImport(),
    simplevars(),
    postcssFunctions(customPostCSSFunctions),
    nested(),
    cssnext({ warnForDuplicates: false, }),
    autoprefixer(),
    cssnano()
  ],
}

export default [
  {
    input: 'src/js/main.js',
    output: [
      !production ? { file: 'dist/bundle.js', format: 'iife' } : { file: 'dist/bundle.min.js', format: 'iife' , plugins: [terser()] }
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
      }),
      (!production && browsersync({
        port: 4440,
        files: ['dist/*.css', 'dist/*.js', 'views/**'],
        reloadDelay: 200,
        serveStatic: ['dist'],
        proxy: {
          target: 'http://' + config.storyblok.domain + '/',
          reqHeaders: function () {
            return {
              'accept-encoding': 'identity',
              'agent': false,
              'browsersyncblok': true,
              'storyblokenv': config.storyblok.environment
            }
          }
        },
      }))
    ]
  },
  {
    input: 'src/css/above.css',
    output: {
      file: 'dist/above.css'
    },
    plugins: [
      postcss(postCSSOptions),
      copy({
        targets: [
          { src: 'dist/above.css', dest: 'views/components/', rename: '_css_above.liquid' }
        ]
      })
    ]
  },
  {
    input: 'src/css/below.css',
    output: { file: 'dist/below.css', },
    plugins: [
      postcss(postCSSOptions),
    ]
  }
]
