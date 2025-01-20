import Basic from './basic.vue'
import Index from './index.vue'
import Single from './single.vue'
import Multiple from './multiple.vue'
import MenuSlot from './menuSlot.vue'
import Slot from './slot.vue'

export default {
  install: (app: any) => {
    app.component('TableBasic', Basic)
    app.component('TableIndex', Index)
    app.component('TableSingle', Single)
    app.component('TableMultiple', Multiple)
    app.component('TableMenuSlot', MenuSlot)
    app.component('TableSlot', Slot)
  },
}
