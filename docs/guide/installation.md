# 安装

## 依赖说明

- Vue.js（3）
- Element Plus
- @element-plus/icons-vue

## 下载方式

::: code-group

```sh [npm]
npm install m-eleplus-crud
```

```sh [yarn]
yarn add m-eleplus-crud
```

```sh [pnpm]
pnpm add m-eleplus-crud
```

:::

```ts
import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import MElePlusCrud from 'm-eleplus-crud'
import 'm-eleplus-crud/dist/index.css'

const app = createApp({
  // something vue options here ...
})

app.use(ElementPlus, {
  // something element-plus options here ...
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(MElePlusCrud, {
  // something m-eleplus-crud options here ...
})
```
