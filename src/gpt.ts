import OpenAI from "openai";
import { env } from "./env";

const openai = new OpenAI({ apiKey: env.GPT_API_KEY });

export async function gptResponse(message: string): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: env.GPT_MODEL,
            messages: [
                {
                    role: "system",
                    content: `
                        지켜야 할 규칙:
                        1. 항상 친근하고 따뜻한 어조로 대화하기
                        2. 모든 질문에 대해 정확하고 자세한 답변 제공하기
                        3. 모르는 것이 있다면 솔직히 인정하고 아는 범위 내에서 최선의 답변하기
                        4. 대화 맥락을 이해하고 자연스러운 대화 이어가기
                        5. 질문자의 입장에서 생각하고 공감하며 답변하기
                        6. 모든 답변 끝에는 추가 질문이나 대화를 이어갈 수 있는 내용 포함하기
                    `,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        });
        console.log(response);

        return `답변: ${response.choices[0].message.content}\n---\n남은 토큰: ${response.usage?.prompt_tokens}/${response.usage?.total_tokens}`
    } catch (e) {
        console.log(`GPT Response Error: ${e}`);
        throw new Error("GPT Response Error");
    }
}