<template>
    <div class="container">
        <p>Volume: {{ Math.round(volume) }}</p>

        <div ref="$container" @mousedown="handleMouseDown">
            <div
                ref="$controller"
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
import { ref, watch } from "vue";

const isMouseDown = ref(false);
const isMoving = ref(false);
const isLeftMouseDown = ref(false);

const volume = ref(100);

const $container = ref<null | HTMLDivElement>(null);
const $controller = ref<null | HTMLDivElement>(null);
const controllerDeg = ref(0);

// 사용자가 직접 돌릴 때
function setDegree(event: MouseEvent) {
    const { clientX, clientY } = event;
    let { left, top } = $container.value!.getBoundingClientRect();

    top += 20;

    // 왼쪽 부분 드래그할 경우
    if (isLeftMouseDown.value) {
        const centerX = left + 100; // 컨트롤러의 중심점 X 좌표를 수동으로 조정

        const dx = clientX - centerX;
        const dy = clientY - top;

        const angleRadians = Math.atan2(dy, dx);
        controllerDeg.value =
            angleRadians * (180 / Math.PI) + (dy > 0 ? -180 : 180);
    } else {
        left += 100;

        const dx = clientX - left;
        const dy = clientY - top;

        const angleRadians = Math.atan2(dy, dx);
        controllerDeg.value = angleRadians * (180 / Math.PI);
    }
}

// 돌리는 걸 중지하고 원상복귀할 때
function calcDegree() {
    if ($controller.value === null) {
        return null;
    }

    const { transform } = getComputedStyle($controller.value);

    const values = transform.split("(")[1].split(")")[0].split(",");
    const a = Number(values[0]);
    const b = Number(values[1]);

    controllerDeg.value = Math.atan2(b, a) * (180 / Math.PI);
}

function handleMouseMove(event: MouseEvent) {
    if (!isMouseDown.value) {
        return;
    }

    setDegree(event);
}

function handleMouseUp() {
    isMouseDown.value = false;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    function animate() {
        calcDegree();

        if (controllerDeg.value !== 0) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);

    // transition 0.3s
    setTimeout(() => {
        isMoving.value = false;
    }, 300);
}

function handleMouseDown(event: MouseEvent) {
    isMouseDown.value = true;
    isMoving.value = true;

    if ($container.value === null) {
        return;
    }

    const { clientX } = event;
    const { left, width } = $container.value.getBoundingClientRect();
    const centerX = left + width / 2; // 컨트롤러 중심 X 좌표

    isLeftMouseDown.value = clientX < centerX;

    setDegree(event);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
}

watch(isMoving, (to) => {
    function animate() {
        const degree = controllerDeg.value;

        // 반대쪽 각도 예외처리
        const calcDegree =
            degree < -90
                ? -90 + Math.abs(degree + 90)
                : degree > 90
                ? 90 - Math.abs(degree - 90)
                : degree;

        // 변경될 볼륨
        const afterVolume = volume.value + calcDegree / 30;

        // min, max 예외처리
        if (afterVolume > 100) {
            volume.value = 100;
        } else if (afterVolume < 0) {
            volume.value = 0;
        } else {
            volume.value = afterVolume;
        }

        if (isMoving.value) {
            requestAnimationFrame(animate);
        }
    }

    if (to) {
        requestAnimationFrame(animate);
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
