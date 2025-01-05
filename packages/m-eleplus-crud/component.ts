import { MTable } from '@m-eleplus-crud/components/table'
import { MConfigProvider } from '@m-eleplus-crud/components/config-provider'
import { MSearch } from '@m-eleplus-crud/components/search'
import { MPicture } from '@m-eleplus-crud/components/picture'
import { MDialog } from '@m-eleplus-crud/components/dialog'
import { MQrcode } from '@m-eleplus-crud/components/qrcode'
import { MBarcode } from '@m-eleplus-crud/components/barcode'

import type { Plugin } from 'vue'

export default [
  MTable,
  MConfigProvider,
  MSearch,
  MPicture,
  MDialog,
  MQrcode,
  MBarcode,
] as Plugin[]
