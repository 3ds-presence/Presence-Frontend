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
      <a href="/dyn/boot.firm" class="btn btn-download" download>
        {{ $t('installation.downloadBinary') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>