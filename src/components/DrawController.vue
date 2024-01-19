<template>
    <div class="container">
        <span>Volume</span>
        <canvas
            width="140"
            height="10"
            ref="$canavas"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
        ></canvas>
        <span>{{ volume }}%</span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const volume = ref(0);

const $canavas = ref<null | HTMLCanvasElement>(null);
const $ctx = computed<null | CanvasRenderingContext2D>(() =>
    $canavas.value === null ? null : $canavas.value.getContext("2d"),
);

const isMouseDown = ref(false);

function handleMouseMove(event: MouseEvent) {
    if (!isMouseDown.value || $ctx.value === null) {
        return;
    }

    const { offsetX, offsetY } = event;
    $ctx.value.fillStyle = "black";
    $ctx.value.fillRect(offsetX, offsetY, 1, 1);
}

function handleMouseUp() {
    isMouseDown.value = false;

    document.removeEventListener("mouseup", handleMouseUp);
}

function handleMouseDown() {
    isMouseDown.value = true;

    document.addEventListener("mouseup", handleMouseUp);
}
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
        border: 1px solid #ccc;
    }
}
</style>
