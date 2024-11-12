import { Client, Events, GatewayIntentBits } from "discord.js";
import { searchYoutube } from "./youtube";
import { env } from "./env";

export const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
]});

export const checkMessage = async () => client.on("messageCreate", async (message) => {
    const value = message.content;
    if (value.split("!")[0] === "준형봇") {
        if (value.split("!")[1]) {
            message.reply(await searchYoutube(value.split("!")[1]));
        } else {
            message.reply("준형봇입니다! 왜 부르셨죠??");
        }
    } else if (value === "사용법?") {
        message.reply("준형봇 입력 후 뒤에 !를 붙여주세요.\n그 뒤에 검색하고 싶은 유튜브를 적어주세요!");
    }
});

export const clientCheck = () => client.once(Events.ClientReady, readyClient => {
    console.log("⚡️ 준형 봇이 준비되었습니다!");
});

export const clientLogin = () => client.login(env.DISCORD_BOT_TOKEN);