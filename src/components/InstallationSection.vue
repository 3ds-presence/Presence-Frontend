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
    <h2 class="card-title">{{ $t('installation.title') }}</h2>

    <h3>{{ $t('installation.prerequisites') }}</h3>
    <p>
      {{ $t('installation.prerequisitesText') }}
    </p>

    <h3>{{ $t('installation.procedure') }}</h3>
    <p>
      {{ $t('installation.procedureText') }}
    </p>

    <h4>{{ $t('installation.steps') }}</h4>
    <ul>
      <li v-for="(step, i) in $tm('installation.stepsList')" :key="i">{{ step }}</li>
    </ul>

    <div style="margin-top: 20px;">
      <DownloadButton />
    </div>
  </div>
</template>

<script setup lang="ts">
import DownloadButton from './DownloadButton.vue'
</script>
