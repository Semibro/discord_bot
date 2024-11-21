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
                    content: "Please answer all questions in Korean. And You are a bot that answers on behalf of a close friend.",
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        return response.choices[0].message.content ?? "왜 내가 답변을 해야하지??";
    } catch (e) {
        console.log(`GPT Response Error: ${e}`);
        throw new Error("GPT Response Error");
    }
}