import Basic from './basic.vue'
import Col from './col.vue'
import Order from './order.vue'

export default {
  install: (app: any) => {
    app.component('SearchBasic', Basic)
    app.component('SearchCol', Col)
    app.component('SearchOrder', Order)
  },
}
