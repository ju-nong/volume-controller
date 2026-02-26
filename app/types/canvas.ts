/**
 * FastAPI가 보내주는 순수 데이터 구조
 */
interface PredictResponse {
    volume: number;
    confidence: number;
    status: string;
}

export type { PredictResponse };
