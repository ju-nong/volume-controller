<template>
    <div class="container">
        <div>
            <canvas
                :width="WIDTH"
                :height="HEIGHT"
                ref="$canavas"
                @mousedown="handleMouseDown"
                @mousemove="handleMouseMove"
            >
            </canvas>
            <p class="volume">Volume: {{ volume }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const WIDTH = 140;
const HEIGHT = 10;
const LENGTH = WIDTH * HEIGHT;

import { ref, computed } from "vue";

const drawnLength = ref(0);
const volume = computed(() => Math.floor((drawnLength.value / LENGTH) * 100));

const $canavas = ref<null | HTMLCanvasElement>(null);
const $ctx = computed<null | CanvasRenderingContext2D>(() =>
    $canavas.value === null ? null : $canavas.value.getContext("2d"),
);

const isMouseDown = ref(false);

// 그리기
function handleDraw(x: number, y: number) {
    if ($ctx.value === null) {
        return;
    }

    $ctx.value.fillStyle = "black";
    $ctx.value.fillRect(x, y, 1, 1);

    const pixelData = $ctx.value.getImageData(x, y, 1, 1).data;
    if (pixelData[3] === 255) {
        drawnLength.value += 1;
    }
}

// 그려져 있는지 확인
function checkDraw(x: number, y: number) {
    if ($ctx.value === null) {
        return;
    }

    const pixelData = $ctx.value.getImageData(x, y, 1, 1).data;

    // 해당 픽셀이 칠한 곳이 아닐 경우
    if (pixelData[3] === 0) {
        handleDraw(x, y);
    }
}

function handleMouseMove(event: MouseEvent) {
    if (!isMouseDown.value) {
        return;
    }

    const { offsetX, offsetY } = event;
    checkDraw(offsetX, offsetY);
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
    margin: 0 auto;

    > div {
        position: relative;

        > canvas {
            outline: 1px solid #ccc;
        }

        > p {
            top: 50%;
            left: 0;
            transform: translate(-110%, -50%);
        }
    }
}
</style>
