import Basic from './basic.vue'
import customBtns from './customBtns.vue'

export default {
  install: (app: any) => {
    app.component('CrudBasic', Basic)
    app.component('CrudCustomBtns', customBtns)
  },
}
