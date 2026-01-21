<template>
    <div class="container">
        <div>
            <span>Volume: {{ volume }}</span>
            <button @click="handleReset">RESET</button>
            <button @click="isCropMode = !isCropMode">Crop</button>
        </div>

        <canvas
            ref="$canvas"
            width="1024"
            height="490"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseUp"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

type Circle = {
    x: number;
    y: number;
    r: number;
};

const $canvas = ref<HTMLCanvasElement | null>(null);

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 490;
const RADIUS = 10;

// 원 목록
const circles = ref<Circle[]>([]);

// 드래그 상태
let draggingIndex: number | null = null;
let offsetX = 0;
let offsetY = 0;

let isSelecting = false;

let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

/**
 * 크롭 모드 여부
 */
const isCropMode = ref(false);

function initCircles(count: number) {
    circles.value = Array.from({ length: count }, () => ({
        x: Math.random() * (CANVAS_WIDTH - RADIUS * 2) + RADIUS,
        y: Math.random() * (CANVAS_HEIGHT - RADIUS * 2) + RADIUS,
        r: RADIUS,
    }));
}

function draw() {
    const canvas = $canvas.value!;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 원 다시 그림
    ctx.fillStyle = "black";
    for (const c of circles.value) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
    }

    // 🔲 선택 영역 표시
    if (isSelecting) {
        drawSelectionRect(ctx);
    }
}

function getMousePos(e: MouseEvent) {
    const rect = $canvas.value!.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

function onMouseDown(e: MouseEvent) {
    const { x, y } = getMousePos(e);

    // 원 위인지 먼저 검사
    for (let i = circles.value.length - 1; i >= 0; i--) {
        const c = circles.value[i];

        if (!c) {
            continue;
        }

        const dx = x - c.x;
        const dy = y - c.y;

        if (dx * dx + dy * dy <= c.r * c.r) {
            draggingIndex = i;
            offsetX = dx;
            offsetY = dy;
            return;
        }
    }

    // 크롭 모드일 경우
    if (isCropMode.value) {
        // 🔲 빈 공간 → 선택 시작
        isSelecting = true;
        startX = x;
        startY = y;
        currentX = x;
        currentY = y;
    }
}

function onMouseMove(e: MouseEvent) {
    const { x, y } = getMousePos(e);

    if (draggingIndex !== null) {
        const c = circles.value[draggingIndex];

        if (!c) {
            return;
        }

        c.x = x - offsetX;
        c.y = y - offsetY;
        draw();
        return;
    }

    if (isSelecting) {
        currentX = x;
        currentY = y;
        draw();
    }
}

function extractSelectedArea() {
    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    const w = Math.abs(currentX - startX);
    const h = Math.abs(currentY - startY);

    if (w === 0 || h === 0) return;

    const sourceCanvas = $canvas.value!;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;

    const tempCtx = tempCanvas.getContext("2d")!;

    // 1️⃣ 배경을 흰색으로 채우기
    tempCtx.fillStyle = "#FFFFFF"; // 흰색 지정
    tempCtx.fillRect(0, 0, w, h); // 전체 영역 채우기

    // 2️⃣ 이미지 그리기
    tempCtx.globalCompositeOperation = "source-over";

    // ⭐ OCR 인식률을 높이려면 blur는 가급적 제거하는 것이 좋습니다.
    // 만약 꼭 필요하다면 유지하되, 인식률이 낮으면 이 줄을 지워보세요.
    tempCtx.filter = "blur(1px)";

    tempCtx.drawImage(sourceCanvas, x, y, w, h, 0, 0, w, h);

    // 결과 확인 (base64)
    const imageData = tempCanvas.toDataURL("image/png");

    isCropMode.value = false;
    console.log("생성된 이미지 데이터(흰 배경):", imageData);

    sendMessage(imageData);
}

function onMouseUp() {
    if (isSelecting) {
        extractSelectedArea();
    }

    isSelecting = false;
    draggingIndex = null;
    draw();
}

function drawSelectionRect(ctx: CanvasRenderingContext2D) {
    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    const w = Math.abs(currentX - startX);
    const h = Math.abs(currentY - startY);

    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
}

/**
 * 초기화
 */
function handleReset() {
    volume.value = 0;
    initCircles(100);
    draw();
}

/**
 * 볼륨
 */
const volume = ref(0);

/**
 * API 호출
 */
async function sendMessage(imageData: string) {
    try {
        const { data } = await useFetch("/api/canvas", {
            method: "POST",
            body: {
                imageData,
            },
        });

        const { answer } = data.value as any;

        if (answer && typeof answer === "number") {
            volume.value = answer;
        }
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    handleReset();
});
</script>

<style scoped>
.container {
    height: 500px;
    display: flex;
    align-items: center;
    margin: 0 auto;
    flex-direction: column;
    row-gap: 20px;

    > div {
        display: flex;
        align-items: center;
        column-gap: 40px;

        > span {
            font-size: 20px;
            font-weight: 600;
        }

        > button {
            padding: 4px 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
        }
    }

    > canvas {
        width: 1024px;
        height: 490px;
        border: 1px solid #ccc;
    }
}
</style>
