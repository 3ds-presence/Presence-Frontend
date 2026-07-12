<template>
  <div class="card">
    <h2 class="card-title">Informations du compte</h2>
    <div class="info-row">
      <span class="info-label">UUID</span>
      <span class="info-value">{{ uuid }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Clé AES</span>
      <span class="info-value">
        {{ showAes ? aesKeyHex : '••••••••••••••••••••••••••••••••' }}
        <button class="eye-btn" @click="showAes = !showAes" :title="showAes ? 'Masquer' : 'Afficher'">
          {{ showAes ? '🙈' : '👁️' }}
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  uuid: string
  aesKeyHex: string
}>()

const showAes = ref(false)
</script>