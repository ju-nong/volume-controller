<template>
  <div class="wrap">
    <TallController />
    <SlopeController />
    <RandomController />
    <DrawController />
    <VerticalController />
    <CrankController />
    <FixedController />
    <CanvasController />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.wrap {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  justify-content: center;
}
</style>
