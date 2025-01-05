import { withInstall } from '@m-eleplus-crud/utils'
import Picture from './src/picture.vue'
import type { SFCWithInstall } from '@m-eleplus-crud/utils'

export const MPicture: SFCWithInstall<typeof Picture> = withInstall(Picture)
export default MPicture

export * from './src/picture'
export type { PictureInstance } from './src/instance'
