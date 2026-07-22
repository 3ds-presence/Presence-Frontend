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
  <div class="card">
    <h2 class="card-title">{{ $t('accountInfo.title') }}</h2>
    <div class="info-row">
      <span class="info-label">{{ $t('accountInfo.uuid') }}</span>
      <span class="info-value">{{ uuid }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">{{ $t('accountInfo.aesKey') }}</span>
      <span class="info-value">
        {{ showAes ? aesKeyHex : '••••••••••••••••••••••••••••••••' }}
        <button class="eye-btn" @click="showAes = !showAes" :title="showAes ? $t('accountInfo.hide') : $t('accountInfo.show')">
          {{ showAes ? '🙈' : '👁️' }}
        </button>
      </span>
    </div>

    <div class="account-settings">
      <button class="btn btn-settings" @click="toggleSettings">
        {{ $t('accountInfo.settings') }} {{ showSettings ? '▲' : '▼' }}
      </button>
      <div v-if="showSettings" class="settings-dropdown">
        <button class="dropdown-btn" @click="resetAesKey" :disabled="resetting">
          {{ resetting ? $t('accountInfo.resetting') : $t('accountInfo.resetKey') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  uuid: string
  aesKeyHex: string
}>()

const emit = defineEmits<{
  (e: 'aes-key-updated', newKey: string): void
}>()

const showAes = ref(false)
const showSettings = ref(false)
const resetting = ref(false)

function toggleSettings() {
  showSettings.value = !showSettings.value
}

async function resetAesKey() {
  resetting.value = true
  try {
    const formData = new URLSearchParams()
    formData.append('uuid', props.uuid)
    formData.append('aes_key_hex', props.aesKeyHex)

    const response = await fetch('/api/reset_aes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })

    const text = await response.text()
    const result = new URLSearchParams(text)

    if (response.ok) {
      const newKey = result.get('aes_key_hex')
      if (newKey) {
        emit('aes-key-updated', newKey)
        showSettings.value = false
      }
    } else {
      const errMsg = result.get('message') || `Error ${response.status}`
      alert(`Error : ${errMsg}`)
    }
  } catch (e: any) {
    alert(`Error connecting to server : ${e.message || e}`)
  } finally {
    resetting.value = false
  }
}
</script>

<style scoped>
.account-settings {
  margin-top: 16px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.btn-settings {
  background: #555;
  width: 100%;
  justify-content: center;
}

.btn-settings:hover {
  background: #444;
}

.settings-dropdown {
  margin-top: 8px;
  padding: 8px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.dropdown-btn {
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background: #e74c3c;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-btn:hover:not(:disabled) {
  background: #c0392b;
}

.dropdown-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>