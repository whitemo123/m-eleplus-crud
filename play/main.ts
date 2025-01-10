import { Component, createApp } from 'vue';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import MElePlusCrud from 'm-eleplus-crud'
import "@m-eleplus-crud/theme-chalk/src/index.scss"

import { httpGet } from './src/request';


(async () => {
  const apps = import.meta.glob<
    true,
    string,
    () => Promise<{ default: Component }>
  >('./src/*.vue')
  const name = location.pathname.replace(/^\//, '') || 'App'
  const file = apps[`./src/${name}.vue`]
  if (!file) {
    location.pathname = 'App'
    return
  }
  const App = (await file()).default
  const app = createApp(App)

  app.use(ElementPlus, {
    locale: zhCn
  })

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.use(MElePlusCrud, {
    size: 'default',
    httpGet: httpGet.bind(this)
  })

  app.mount('#play')
})()
