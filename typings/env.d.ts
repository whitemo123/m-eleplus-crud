import type { vShow } from 'vue'
import type { INSTALLED_KEY } from '@m-eleplus-crud/constants'

declare global {
  const process: {
    env: {
      NODE_ENV: string
    }
  }

  namespace JSX {
    interface IntrinsicAttributes {
      class?: unknown
      style?: unknown
    }
  }

  declare module 'qrcodejs2-fix'
}

declare module '@vue/runtime-core' {
  export interface App {
    [INSTALLED_KEY]?: boolean
  }

  export interface GlobalComponents {
    Component: (props: { is: Component | string }) => void
  }

  export interface ComponentCustomProperties {
    vShow: typeof vShow
  }
}

export {}
