import { Component, createApp } from 'vue';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import MElePlusCrud from 'm-eleplus-crud'
import "@m-eleplus-crud/theme-chalk/src/index.scss"


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
  app.use(MElePlusCrud)

  app.mount('#play')
})()
