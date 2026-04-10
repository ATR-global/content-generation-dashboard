<template>
  <main class="page">
    <AppHeader />
    <section>
      <h1>Starter Project</h1>
      <p>Scaffolded from the sparked-ui directory conventions.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import AppHeader from '@/components/common/AppHeader.vue';
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 2rem;
}
</style>
