<!--
3DS Presence — Discord Rich Presence for Nintendo 3DS
Copyright (C) 2026 3DS Presence - LeonLeBreton

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

<template>
  <img
    v-if="dataUrl"
    class="qr-code"
    :src="dataUrl"
    :width="size"
    :height="size"
    :alt="alt"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import qrcode from 'qrcode-generator'

const props = withDefaults(
  defineProps<{
    value: string
    cellSize?: number
    margin?: number
    alt?: string
  }>(),
  {
    cellSize: 8,
    margin: 8,
    alt: 'QR code',
  }
)

const qr = computed(() => {
  if (!props.value) {
    return null
  }

  // Type number 0 lets the library pick the smallest QR code that fits,
  // error correction level M balances density and scan reliability.
  const code = qrcode(0, 'M')
  code.addData(props.value)
  code.make()

  return {
    dataUrl: code.createDataURL(props.cellSize, props.margin),
    size: code.getModuleCount() * props.cellSize + props.margin * 2,
  }
})

const dataUrl = computed(() => qr.value?.dataUrl ?? '')
const size = computed(() => qr.value?.size ?? 0)
</script>

<style scoped>
.qr-code {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 12px auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
}
</style>
