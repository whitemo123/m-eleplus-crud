import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import glob from 'fast-glob'
import VueMacros from 'unplugin-vue-macros/vite'
import {
  epPackage,
  epRoot,
  getPackageDependencies,
  pkgRoot,
  projRoot,
} from '@m-eleplus-crud/build-utils'

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let { dependencies } = getPackageDependencies(epPackage)
  dependencies = dependencies.filter((dep) => !dep.startsWith('@types/')) // exclude dts deps

  return {
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@use "/styles/custom.scss" as *;`,
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^m-eleplus-crud(\/(es|lib))?$/,
          replacement: path.resolve(epRoot, 'index.ts'),
        },
        {
          find: /^m-eleplus-crud\/(es|lib)\/(.*)$/,
          replacement: `${pkgRoot}/$2`,
        },
      ],
    },
    server: {
      port: 3000,
      host: true,
      https: !!env.HTTPS ? {} : false,
    },
    build: {
      sourcemap: true,
    },
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue(),
          vueJsx: vueJsx(),
        },
      })
    ],

    optimizeDeps: {
      include: ['vue', '@vue/shared', ...dependencies],
    },
    esbuild: {
      target: 'chrome64',
    },
  }
})
