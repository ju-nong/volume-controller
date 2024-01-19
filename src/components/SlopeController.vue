<template>
    <div class="container">
        <div>{{ controllerDeg }}</div>
        <p>Volume: {{ volume }}</p>

        <div ref="$controller" @mousedown="hanldeMouseDown">
            <div
                :style="`--slope-deg: ${controllerDeg}deg`"
                :class="isMouseDown ? 'moving' : ''"
            >
                <div>
                    <span :style="`--slope-volume: ${volume}%`"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const isMouseDown = ref(false);

const volume = ref(100);

const $controller = ref<null | HTMLDivElement>(null);
const controllerDeg = ref(0);
function setDegree(event: MouseEvent) {
    if ($controller.value === null) {
        return;
    }

    let { left, top } = $controller.value.getBoundingClientRect();

    left += 100;
    top += 20;
    const { clientX, clientY } = event;

    const dx = clientX - left;
    const dy = clientY - top;

    const angleRadians = Math.atan2(dy, dx);

    controllerDeg.value = angleRadians * (180 / Math.PI);
}

function handleMouseUp() {
    isMouseDown.value = false;
}

function handleMouseMove(event: MouseEvent) {
    if (!isMouseDown.value) {
        return;
    }

    setDegree(event);
}

function hanldeMouseDown(event: MouseEvent) {
    isMouseDown.value = true;

    setDegree(event);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
}

watch(isMouseDown, (to) => {
    if (!to) {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }
});
</script>

<style scoped>
.container {
    height: 240px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    column-gap: 20px;

    > p {
        min-width: 120px;
    }

    > div {
        width: 200px;
        height: 40px;

        > div {
            background-color: #ccc;
            border: 2px solid #666;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: s-resize;
            transition: all 0.3s;
            transform: rotate(0deg);

            &.moving {
                transition: all 0s;
                transform: rotate(var(--slope-deg));
            }

            > div {
                width: 60%;
                height: 10%;
                border-radius: 4px;
                background-color: #666;
                position: relative;

                > span {
                    width: 10px;
                    height: 10px;
                    background-color: #fff;
                    border-radius: 100%;
                    display: inline-block;
                    position: absolute;
                    left: var(--slope-volume);
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
}
</style>
