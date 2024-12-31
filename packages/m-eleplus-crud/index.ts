import installer from './defaults'
export * from '@m-eleplus-crud/components'
export * from '@m-eleplus-crud/constants'
export * from '@m-eleplus-crud/hooks'
export * from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer

