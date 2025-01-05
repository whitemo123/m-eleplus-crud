import { withInstall } from '@m-eleplus-crud/utils'
import Barcode from './src/barcode.vue'
import type { SFCWithInstall } from '@m-eleplus-crud/utils'

export const MBarcode: SFCWithInstall<typeof Barcode> = withInstall(Barcode)
export default MBarcode

export * from './src/barcode'
export type { BarcodeInstance } from './src/instance'
