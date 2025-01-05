import { withInstall } from '@m-eleplus-crud/utils'
import Qrcode from './src/qrcode.vue'
import type { SFCWithInstall } from '@m-eleplus-crud/utils'

export const MQrcode: SFCWithInstall<typeof Qrcode> = withInstall(Qrcode)
export default MQrcode

export * from './src/qrcode'
export type { QrcodeInstance } from './src/instance'
