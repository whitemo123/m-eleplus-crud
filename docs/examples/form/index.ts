import Basic from './basic.vue'
import View from './view.vue'

export default {
  install: (app: any) => {
    app.component('FormBasic', Basic)
    app.component('FormView', View)
  },
}
