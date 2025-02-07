import DefaultTheme from 'vitepress/theme'
import './global.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import MElePlusCrud from 'm-eleplus-crud/index.ts'
import '@m-eleplus-crud/theme-chalk/src/index.scss'

import examples from '../../examples'

export default {
  extends: DefaultTheme,
  async enhanceApp({ app }) {
    app.use(ElementPlus, {
      locale: zhCn,
    })

    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }

    // @ts-ignore
    if (!import.meta.env.SSR) {
      app.use(MElePlusCrud, {
        size: 'default',
      })

      for (const example of examples) {
        app.use(example)
      }
    }
  },
}
