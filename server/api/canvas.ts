import type { PredictResponse } from "~/types/canvas";

export default defineEventHandler(async (event): Promise<PredictResponse> => {
    // 1. 설정값 가져오기
    const config = useRuntimeConfig(event);
    const BASE_URL = config.canvasApiBaseUrl; // nuxt.config.ts에서 정한 키값

    const body = await readBody(event);
    const { imageData } = body;

    if (!imageData) {
        throw createError({
            statusCode: 400,
            statusMessage: "imageData is required",
        });
    }

    try {
        // 2. BASE_URL 사용
        const response = await $fetch<PredictResponse>(`${BASE_URL}/predict`, {
            method: "POST",
            body: { image: imageData },
        });

        return response;
    } catch (error: any) {
        console.error("FastAPI 연결 에러:", error.data);
        throw createError({
            statusCode: 500,
            statusMessage: "AI 서버 응답 실패",
        });
    }
});
