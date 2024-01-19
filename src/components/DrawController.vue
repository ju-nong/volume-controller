<template>
    <div class="container">
        <span>Volume</span>
        <canvas></canvas>
        <span>{{ volume }}%</span>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const volume = ref(0);
</script>

<style scoped>
.container {
    height: 240px;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    column-gap: 10px;
    width: 283px;
    margin: 0 auto;

    > canvas {
        width: 140px;
        height: 10px;
        border: 1px solid #ccc;
    }
}
</style>
