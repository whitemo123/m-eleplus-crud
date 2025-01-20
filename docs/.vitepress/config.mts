import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'M ElePlus Crud',
  description: '一个基于Element Plus的CRUD Vue3组件库',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '开始', link: '/guide/installation' },
      { text: '组件', link: '/components/search' },
    ],

    sidebar: [
      {
        text: '开始',
        items: [
          { text: '快速上手', link: '/guide/installation' },
          { text: '全局配置', link: '/guide/global-option' },
        ],
      },
      {
        text: '组件',
        items: [
          { text: 'Search 查询', link: '/components/search' },
          { text: 'Table 列表', link: '/components/table' },
          { text: 'Form 表单', link: '/components/form' },
          { text: 'Crud 增删改查', link: '/components/crud' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/whitemo123/m-eleplus-crud' },
    ],
  },
})
