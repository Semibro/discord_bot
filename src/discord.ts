import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { searchYoutube } from "./youtube";
import { env } from "./env";
import { gptResponse } from "./gpt";

export const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
]});

export const checkMessage = async () => client.on("messageCreate", async (message) => {
    const value = message.content;
    if (value.split("!")[0] === "준형봇") {
        const res = await gptResponse(value.split("!")[1].trim());
        message.reply(res);
    } else if (value.split("?")[0] === "유튜브") {
        message.reply(await searchYoutube(value.split("?")[1]));
    } else if (value === "사용법?") {
        message.reply("준형봇(느낌표) [질문] 으로 질문을 하면 답변을 해드립니다. 유튜브(물음표) [검색어] 로 유튜브 검색을 할 수 있습니다.");
    }
});

export const clientCheck = () => client.once(Events.ClientReady, async readyClient => {
    console.log("⚡️ 준형 봇이 준비되었습니다!");
    
    // 특정 채널에 메시지 보내기
    try {
        const channel = await client.channels.fetch(env.DISCORD_CHANNEL_ID ?? "");
        if (channel && channel instanceof TextChannel) {
            await channel.send("준형봇이 깊은 잠에서 깨어났습니다!");
        }
    } catch (error) {
        console.error("채널 메시지 전송 실패:", error);
    }

    readyClient.user.setActivity("준형봇이 깊은 잠에서 깨어났습니다!");
});

export const clientLogin = () => client.login(env.DISCORD_BOT_TOKEN);