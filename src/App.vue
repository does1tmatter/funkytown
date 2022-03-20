<script setup>
import City from '@/components/City.vue'
</script>

<template>
  <City />
  <div class="abs">
    <div>
      <div>
        FUNKYTOWN
      </div>
      <div class="under">
        ( press space to refresh )
      </div>
    </div>
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
  text-align: center;
  }

  .under {
    font-size: 14px;
    font-weight: 100;
    line-height: 1;
    opacity: 0.5;
  }
</style>
