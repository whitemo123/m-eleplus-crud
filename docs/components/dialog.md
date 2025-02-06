# 弹窗 Dialog

_弹窗组件_

## 基础用法

<DialogBasic />

## Dialog API

### Dialog Attributes

| 属性名              | 说明                               | 类型                                         | 默认值        |
| :------------------ | :--------------------------------- | :------------------------------------------- | :------------ |
| size                | 组件尺寸                           | `default` &#124; `small` &#124; `large`      | --            |
| v-model             | 弹窗状态                           | `boolean`                                    | --            |
| title               | 弹窗标题                           | `string`                                     | ''            |
| width               | 弹窗宽度                           | `string`                                     | '600px'       |
| top                 | 弹窗距离顶部                       | `string`                                     | '2vh'         |
| appendToBody        | 是否插入到 body                    | `boolean`                                    | true          |
| closeOnClickModal   | 是否可以通过点击 modal 关闭 Dialog | `boolean`                                    | false         |
| closeOnnPressEscape | 是否可以通过按下 ESC 关闭 Dialog   | `boolean`                                    | false         |
| beforeClose         | 弹窗关闭前回调                     | `(done: (cancel?: boolean) => void) => void` | --            |
| draggable           | 为 dialog 开启拖拽功能             | `boolean`                                    | true          |
| destroyOnClose      | 当关闭 Dialog 时，销毁其中的元素   | `boolean`                                    | true          |
| saveBtn             | 保存按钮是否展示                   | `boolean`                                    | true          |
| cancelBtn           | 取消按钮是否展示                   | `boolean`                                    | true          |
| saveBtnText         | 保存按钮文字                       | `string`                                     | '确 认'       |
| cancelBtnText       | 取消按钮文字                       | `string`                                     | '取 消'       |
| saveBtnIcon         | 保存按钮图标                       | `string`                                     | 'CircleCheck' |
| cancelBtnIcon       | 取消按钮图标                       | `string`                                     | 'CircleClose' |

### Dialog 事件

| 名称   | 说明     | 类型                                    |
| :----- | :------- | :-------------------------------------- |
| close  | 弹窗关闭 | `() => void`                            |
| cancel | 弹窗取消 | `() => void`                            |
| enter  | 弹窗确认 | `done: () => void, loading: () => void` |

### Dialog 插槽

| 名称    | 说明         | 值          |
| :------ | :----------- | :---------- |
| default | 弹窗主体内容 | `{loading}` |
| btns    | 底部按钮区域 | `{loading}` |

### Dialog Exposes

| 名称 | 说明 | 类型 |
| :--- | :--- | :--- |
