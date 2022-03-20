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
.abs {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;
  font-size: 92px;
  pointer-events: none;
  }
</style>
