import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { searchYoutube } from "./youtube";
import { env } from "./env";
import { gptResponse } from "./gpt";
import { getKomentle, playMusic } from "./functions";

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
        message.reply("- `질문(물음표) 내용` 을 통해 준형봇에게 질문할 수 있습니다!\n- `유튜브(물음표) 검색어` 를 통해서 유튜브를 검색할 수 있습니다.\n- `꼬맨틀(물음표) 단어` 를 통해서 꼬맨틀을 플레이할 수 있습니다.\n- `음악(물음표) 노래 제목` 을 통해서 준형봇에게 음악재생을 시킬 수 있습니다.");
    } else {
        const keyWord = value.split("?")[1]?.trim() ?? "";
        if (seperator === "질문") {
            const res = await gptResponse(keyWord);
            message.reply(res);
        } else if (seperator === "유튜브") {
            message.reply(await searchYoutube(keyWord));
        } else if (seperator === "꼬맨틀") {
            message.reply(await getKomentle(keyWord));
        } else if (["음악", "노래"].includes(seperator)) {
            const voiceChannel = message.member?.voice.channel;
            if (!voiceChannel) {
                message.reply("음성 채널에 접속해주세요!");
            } else {
                const channelId = voiceChannel.id;
                const guildId = message.guild?.id ?? "";
                const adapterCreator = message.guild?.voiceAdapterCreator ?? voiceChannel.guild.voiceAdapterCreator;
                message.reply(await playMusic(channelId, guildId, adapterCreator, await searchYoutube(keyWord)));
            }
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
