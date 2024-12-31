import { componentSizeMap } from '@m-eleplus-crud/constants'

import type { ComponentSize } from '@m-eleplus-crud/constants'

export const getComponentSize = (size?: ComponentSize) => {
  return componentSizeMap[size || 'default']
}
