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
  <footer class="site-footer">
    <span>{{ $t('footer.copyright') }}</span>
    <span class="footer-separator">·</span>
    <span>{{ $t('footer.license') }}</span>
    <span class="footer-separator">·</span>
    <a href="/privacy" @click.prevent="showPrivacy = true">{{ $t('footer.privacy') }}</a>

    <PrivacyPolicyModal v-if="showPrivacy" @close="showPrivacy = false" />
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PrivacyPolicyModal from './PrivacyPolicyModal.vue'

const showPrivacy = ref(false)
</script>