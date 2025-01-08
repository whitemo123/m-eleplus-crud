<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { crudEmits, crudProps } from './crud'

const COMPONENT_NAME = 'MCrud'
defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(crudProps)
const emit = defineEmits(crudEmits)

watch(() => prop)
</script>
