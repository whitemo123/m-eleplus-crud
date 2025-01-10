<script lang="ts" setup>
import { useSlots } from 'vue'

interface IProps {
  icon?: string
}

defineProps<IProps>()

const slots = useSlots() as any
</script>

<template>
  <button>
    <el-icon v-if="icon">
      <component :is="icon" />
    </el-icon>
    <span v-if="slots.default">
      <slot />
    </span>
  </button>
</template>

<style lang="scss" scoped></style>
