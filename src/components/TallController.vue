<template>
    <div class="container">
        <div
            class="controller"
            :class="{ controlling: isMouseDown }"
            @mousemove="handleMouseMove"
        >
            <div ref="$progress" @mousedown="handleMouseDown">
                <div :style="`--tall-width: ${progressWidth}%`"></div>
            </div>
        </div>
        <div class="icon">
            <VolumeIcon :width="progressWidth" />
        </div>
        <p class="volume">Volume: {{ Math.floor(progressWidth) }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VolumeIcon } from ".";

const isMouseDown = ref(false);

const $progress = ref<null | HTMLDivElement>(null);
const progressWidth = ref(100);

function calcWidth(clientX: number) {
    if ($progress.value === null) {
        return;
    }

    const { left } = $progress.value.getBoundingClientRect();

    const width = ((clientX - left) / 14) * 100;
    progressWidth.value = width > 100 ? 100 : width < 0 ? 0 : width;
}

let mouseUpEvent: any = null;

function handleMouseDown(event: MouseEvent) {
    isMouseDown.value = true;

    mouseUpEvent = window.addEventListener("mouseup", () => {
        isMouseDown.value = false;
        window.removeEventListener("mouseup", mouseUpEvent);
    });

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
    position: relative;

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

        &.controlling {
            visibility: visible;
        }

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

    > p {
        left: 0;
        bottom: 25px;
        transform: translate(-110%, 50%);
    }
}
</style>
