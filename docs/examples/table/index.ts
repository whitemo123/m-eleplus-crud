import Basic from './basic.vue'
import Index from './index.vue'
import Single from './single.vue'

export default {
  install: (app: any) => {
    app.component('TableBasic', Basic)
    app.component('TableIndex', Index)
    app.component('TableSingle', Single)
  },
}
