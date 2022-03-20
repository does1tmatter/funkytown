<script setup>
import City from '@/components/City.vue'
</script>

<template>
  <City />
  <div class="abs">
    FUNKYTOWN
  </div>
</template>

<style>
@import './assets/base.css';

html {
  background-color: #171d1c;
  overflow: hidden;
}

#app {
  font-weight: normal;
}

.abs {
  min-width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: 900;
  font-size: 92px;
  pointer-events: none;
}
</style>
