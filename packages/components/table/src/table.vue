<script lang="ts" setup>
import { useLocale } from '@m-eleplus-crud/hooks'
import { tableProps } from './table'

const COMPONENT_NAME = 'MTable'
defineOptions({
  name: COMPONENT_NAME,
})

defineProps(tableProps)

const { t } = useLocale()
</script>

<template>
  <div class="test">{{ t('m.table.menuTitle') }}</div>
</template>
