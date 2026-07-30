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
        <button class="dropdown-btn dropdown-btn-warning" @click="resetAesKey" :disabled="resetting">
          {{ resetting ? $t('accountInfo.resetting') : $t('accountInfo.resetKey') }}
        </button>
        <button class="dropdown-btn dropdown-btn-primary" @click="exportData" :disabled="exporting">
          {{ $t('accountInfo.exportData') }}
        </button>
        <button class="dropdown-btn dropdown-btn-danger" @click="confirmDelete">
          {{ $t('accountInfo.deleteAccount') }}
        </button>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="confirm-overlay">
      <div class="confirm-box">
        <p>{{ $t('accountInfo.deleteConfirm') }}</p>
        <div class="confirm-buttons">
          <button class="btn btn-danger" @click="deleteAccount" :disabled="deleting">
            {{ deleting ? '...' : $t('accountInfo.deleteAccount') }}
          </button>
          <button class="btn btn-cancel" @click="showDeleteConfirm = false">Cancel</button>
        </div>
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
const exporting = ref(false)
const deleting = ref(false)
const showDeleteConfirm = ref(false)

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

async function exportData() {
  exporting.value = true
  try {
    const url = `/api/account/export?uuid=${encodeURIComponent(props.uuid)}&aes_key_hex=${encodeURIComponent(props.aesKeyHex)}`
    const response = await fetch(url)
    if (!response.ok) {
      const text = await response.text()
      const result = new URLSearchParams(text)
      alert(result.get('message') || `Error ${response.status}`)
      return
    }
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = '3ds-presence-export.json'
    link.click()
    URL.revokeObjectURL(link.href)
  } catch (e: any) {
    alert(`Error exporting data: ${e.message || e}`)
  } finally {
    exporting.value = false
  }
}

function confirmDelete() {
  showDeleteConfirm.value = true
}

async function deleteAccount() {
  deleting.value = true
  try {
    const formData = new URLSearchParams()
    formData.append('uuid', props.uuid)
    formData.append('auth_hex', props.aesKeyHex)

    const response = await fetch('/api/account/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })

    if (response.ok) {
      showDeleteConfirm.value = false
      window.location.reload()
    } else {
      const text = await response.text()
      const result = new URLSearchParams(text)
      alert(result.get('message') || `Error ${response.status}`)
    }
  } catch (e: any) {
    alert(`Error deleting account: ${e.message || e}`)
  } finally {
    deleting.value = false
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
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dropdown-btn {
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dropdown-btn-warning {
  background: #e67e22;
}

.dropdown-btn-warning:hover:not(:disabled) {
  background: #d35400;
}

.dropdown-btn-primary {
  background: #3498db;
}

.dropdown-btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.dropdown-btn-danger {
  background: #e74c3c;
}

.dropdown-btn-danger:hover:not(:disabled) {
  background: #c0392b;
}

.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.confirm-box {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  text-align: center;
}

.confirm-box p {
  margin-bottom: 20px;
  line-height: 1.5;
  color: #333;
}

.confirm-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-danger {
  background: #e74c3c;
  color: #fff;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-cancel {
  background: #95a5a6;
  color: #fff;
}

.btn-cancel:hover {
  background: #7f8c8d;
}
</style>