import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { searchYoutube } from "./youtube";
import { env } from "./env";
import { gptResponse } from "./gpt";
import { addToQueue, getQueueStatus, skipTrack, stopQueue } from "./functions";

export const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
]});

export const checkMessage = async () => client.on("messageCreate", async (message) => {
    const value = message.content;
    const seperator = value.split("?")[0].trim();

    if (["사용법", "도움말", "help"].includes(seperator)) {
        message.reply(
            "# 사용법\n" +
            "- `질문? 내용` 을 통해 준형봇에게 질문할 수 있습니다!\n" +
            "- `유튜브? 검색어` 를 통해서 유튜브를 검색할 수 있습니다.\n" +
            "- `음악? 노래 제목` 을 통해서 준형봇에게 음악재생을 시킬 수 있습니다.\n" +
            "- `재생목록?` 을 통해서 현재 재생목록에 있는 노래를 확인할 수 있습니다.\n" +
            "- `다음곡?` 을 통해 다음곡으로 넘어갈 수 있습니다.\n" +
            "- `정지?` 을 통해 모든 노래를 정지할 수 있습니다.\n" +
            "- `당근?` 를 통해서 숨기고 싶은 메시지를 묻어버릴 수 있습니다."
        );
    } else {
        const keyWord = value.split("?").slice(1).join("");
        
        if (seperator === "질문") {
            const res = await gptResponse(keyWord);
            message.reply(res);
        } else if (seperator === "유튜브") {
            message.reply(await searchYoutube(keyWord));
        } else if (["음악", "노래"].includes(seperator)) {
            const voiceChannel = message.member?.voice.channel;
            if (!voiceChannel) {
                message.reply("음성 채널에 접속해주세요!");
            } else {
                const channelId = voiceChannel.id;
                const guildId = message.guild?.id ?? "";
                const adapterCreator = message.guild?.voiceAdapterCreator ?? voiceChannel.guild.voiceAdapterCreator;
                message.reply(await addToQueue(channelId, guildId, adapterCreator, await searchYoutube(keyWord), keyWord));
            }
        } else if (seperator === "재생목록") {
            message.reply(getQueueStatus(message.guild?.id ?? ""));
        } else if (["다음노래", "다음음악", "건너뛰기", "다음곡"].includes(seperator)) {
            message.reply(skipTrack(message.guild?.id ?? ""));
        } else if (["노래정지", "정지", "음악정지"].includes(seperator)) {
            message.reply(stopQueue(message.guild?.id ?? ""));
        } else if (seperator === "당근") {
            message.reply(`${":carrot:\n".repeat(100)}`);
        }
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
