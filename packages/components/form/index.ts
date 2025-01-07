import { withInstall } from '@m-eleplus-crud/utils'
import Form from './src/form.vue'
import type { SFCWithInstall } from '@m-eleplus-crud/utils'

export const MForm: SFCWithInstall<typeof Form> = withInstall(Form)
export default MForm

export * from './src/form'
export type { FormInstance } from './src/instance'
