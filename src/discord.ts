import { Client, Events, GatewayIntentBits } from "discord.js";
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

export const clientCheck = () => client.once(Events.ClientReady, readyClient => {
    console.log("⚡️ 준형 봇이 준비되었습니다!");
});

export const clientLogin = () => client.login(env.DISCORD_BOT_TOKEN);