<template>
    <div class="container">
        <div
            class="controller"
            @mousemove="handleMouseMove"
            @mouseup="isMouseDown = false"
            @mouseleave="isMouseDown = false"
        >
            <div ref="$progress" @mousedown="handleMouseDown">
                <div :style="`--tall-width: ${progressWidth}%`"></div>
            </div>
        </div>
        <div class="icon">
            <VolumeIcon :width="progressWidth" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { VolumeIcon } from ".";

const isMouseDown = ref(false);

const $progress = ref<null | HTMLDivElement>(null);
const progressWidth = ref(100);
const progressLeft = computed(() =>
    $progress.value === null ? 0 : $progress.value.getBoundingClientRect().left,
);

function calcWidth(clientX: number) {
    const width = ((clientX - progressLeft.value) / 14) * 100;
    progressWidth.value = width > 100 ? 100 : width < 0 ? 0 : width;
}

function handleMouseDown(event: MouseEvent) {
    isMouseDown.value = true;

    const { clientX } = event;

    calcWidth(clientX);
}

function handleMouseMove(event: MouseEvent) {
    if (!isMouseDown.value) {
        return;
    }

    const { clientX } = event;

    calcWidth(clientX);
}
</script>

<style scoped>
.container {
    margin: 20px auto 0px auto;
    width: 50px;
    height: 240px;
    cursor: pointer;

    &:hover {
        .controller {
            visibility: visible;
        }
    }

    .icon {
        width: 50px;
        height: 50px;
        padding: 10px;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.8);
    }

    .controller {
        visibility: hidden;
        width: 50px;
        height: 190px;
        background-color: rgba(0, 0, 0, 0.8);
        bottom: 50px;
        left: 0;
        padding: 16px 18px;

        > div {
            width: 100%;
            height: 100%;

            > div {
                width: var(--tall-width);
                height: 100%;
                background-color: #247c54;
            }
        }
    }
}
</style>
