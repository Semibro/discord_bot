import fetch from "node-fetch";
import { OmitPartialGroupDMChannel, Message } from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, VoiceConnectionStatus, joinVoiceChannel } from "@discordjs/voice";
import { Readable } from "stream";
import { spawn } from "child_process";

type komentleResponseType = {
    guess?: string;
    sim?: number;
    rank?: string;
    detail?: { type: string, description: string };
}

export const getKomentle = async (word: string): Promise<string> => {
    const baseDate = new Date("2022-04-01");
    const today = new Date();
    const diffTime = today.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const encodeWord = encodeURIComponent(word);
    const slicedEncodeWord = encodeWord.slice(3);
    
    const response = await fetch(`https://semantle-ko.newsjel.ly/guess/${diffDays}/${slicedEncodeWord}`);
    const data = await response.json() as komentleResponseType;
    console.log(data);

    if (data.guess) {
        return `유사도: ${data.sim?.toFixed(3) ?? "유사도를 찾지 못했습니다."}  |  순위: ${data.rank}`;
    } else {
        return data.detail?.description ?? "처리할 수 없는 입력입니다.";
    }
};

export const playMusic = async (message: OmitPartialGroupDMChannel<Message<boolean>>, url: string): Promise<string> => {
    const voiceChannel = message.member?.voice.channel
    if (!voiceChannel) return "음성 채널에 접속해주세요!";

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild?.id ?? "",
        adapterCreator: message.guild?.voiceAdapterCreator ?? voiceChannel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
        console.log("<===== 음성 채널에 성공적으로 연결되었습니다. =====>");
    });

    const ytDlpProcess = spawn('yt-dlp', [
        '-f', 'bestaudio',
        '--extract-audio',
        '--audio-format', 'mp3',
        '--output', '-',
        url
    ]);

    const readableStream = new Readable().wrap(ytDlpProcess.stdout);
    const resource = createAudioResource(readableStream);
    const player = createAudioPlayer();

    player.play(resource);
    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
    });
    connection.subscribe(player);

    return `현재 재생음악: ${url}`;
};
