# 全局配置

## 组件大小

全局设置组件的 size 属性

```ts
app.use(MElePlusCrud, {
  size: 'default', // large small
})
```

## 多语言

可设置组件默认语言，注意：`和Element Plus设置的locale无关联`，组件内部暂时只支持 zh-cn、en

```ts
import zhCn from 'm-eleplus-crud/es/locale/lang/zh-cn'
import en from 'm-eleplus-crud/es/locale/lang/en'

app.use(MElePlusCrud, {
  locale: zhCn, // en
})
```

## Http GET 请求

在组件中涉及到 dicUrl 等需要进行网络请求的，最终都会调用此属性。

import 自己封装好的 GET 方法

```ts
export const httpGet = (url: string, params: any, headers: any) => {}

app.use(MElePlusCrud, {
  httpGet: httpGet.bind(this),
})
```

## 表格高度额外调节参数

MCrud 设置 option.height 属性为`auto`，可设置`calcHeight`来调节表格高度

```ts
app.use(MElePlusCrud, {
  calcHeight: 20, // 自动获取高度时，额外减去20px
})
```
