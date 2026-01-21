// import { EasyOCR } from "node-easyocr";
// import fs from "fs/promises";
// import path from "path";
import sharp from "sharp"; // 추가

// const ocr = new EasyOCR();
// let isReady = false;

// ocr.init(["en"]).then(() => {
//     isReady = true;
//     console.log("✅ EasyOCR 엔진 준비 완료!");
// });

// export default defineEventHandler(async (event) => {

//     try {
//     if (!isReady) return { error: "Engine not ready" };

//         const body = await readBody(event);
//         const { imageData } = body;
//         if (!imageData) return { error: "imageData required" };

//         const base64 = imageData.replace(/^data:image\/\w+;base64,/, "");
//         const buffer = Buffer.from(base64, "base64");

//         const tempPath = path.join(process.cwd(), `tmp_${Date.now()}.png`);

//         await sharp(buffer)
//             .resize({ width: 800 }) // 너무 크면 오히려 노이즈가 많아지므로 800px 조절
//             .grayscale()
//             .blur(2) // 블러를 줄여서 형태가 너무 뭉개지지 않게 함
//             .threshold(160) // 이진화
//             .sharpen() // 🌟 추가: 경계선을 날카롭게 세움
//             .toFile(tempPath);

//         // OCR 실행 시 '숫자만' 읽도록 강력하게 제한하는 팁 (내부 명령어로 전달)
//         // 만약 라이브러리 제약으로 옵션 전달이 안 된다면 기본 실행
//         const result = await ocr.readText(tempPath);

//         console.log("---- 전처리 후 이미지로 재시도 결과 ----");
//         console.dir(result, { depth: null });

//         console.log("---- 전처리 후 OCR Raw Data ----");
//         console.dir(result, { depth: null });

//         await fs.unlink(tempPath);

//         let extractedText = "";
//         if (Array.isArray(result)) {
//             extractedText = result.map((item) => item.text || "").join("");
//         } else {
//             extractedText = String(result || "");
//         }

//         // 🌟 수정된 결과 가공 로직
//         let finalNumber = "";
//         if (Array.isArray(result) && result.length > 0) {
//             // confidence가 0이더라도 일단 찍힌 텍스트가 있는지 확인
//             finalNumber = result
//                 .map((item) => item.text || "")
//                 .join("")
//                 .replace(/[^0-9]/g, ""); // 일단 숫자만 남김
//         }

//         // 만약 숫자가 안 잡혔다면, 원본 텍스트에 뭐가 찍혔는지라도 반환해서 확인
//         const debugText = Array.isArray(result)
//             ? result.map((i) => i.text).join("|")
//             : result;

//         return {
//             number: finalNumber,
//             debug: debugText, // 여기에 뭐가 찍히는지 확인해 보세요!
//             raw: result,
//         };
//     } catch (error) {
//         console.error("OCR 상세 에러 발생:", error);
//         return { error: error.message };
//     }
// });

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { imageData } = body;

    if (!imageData) {
        return { error: "messages required" };
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error("OPENAI_API_KEY not set");
    }

    const res = await $fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: {
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `
    너는 이미지에서 숫자를 인식하는 OCR 모델이다.
    이 이미지는 점(dot)들이 모여 숫자를 표현한 것이다.
    연결된 선이 없어도 전체 패턴을 보고 숫자를 추론하라.
    - 숫자 하나만 반환한다
    - 숫자의 범위는 -1 ~ 100까지다
    - 숫자를 확신할 수 없으면 -1을 반환하라
    - 출력은 반드시 JSON만 허용한다
    - 예시: { "answer": 17 }
            `.trim(),
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "이 이미지에 있는 숫자를 추출해줘.",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageData,
                                detail: "high",
                            },
                        },
                    ],
                },
            ],

            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "digit_answer",
                    schema: {
                        type: "object",
                        properties: {
                            answer: { type: "integer" },
                        },
                        required: ["answer"],
                        additionalProperties: false,
                    },
                },
            },
        },
    });

    return {
        answer: JSON.parse((res as any).choices[0].message.content)?.answer,
    };
});
