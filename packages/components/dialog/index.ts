import { withInstall } from '@m-eleplus-crud/utils'
import Dialog from './src/dialog.vue'
import type { SFCWithInstall } from '@m-eleplus-crud/utils'

export const MDialog: SFCWithInstall<typeof Dialog> = withInstall(Dialog)
export default MDialog

export * from './src/dialog'
export type { DialogInstance } from './src/instance'
