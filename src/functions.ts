import fetch from "node-fetch";
import { InternalDiscordGatewayAdapterCreator } from "discord.js";
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    VoiceConnectionStatus,
    joinVoiceChannel,
    AudioPlayer,
} from "@discordjs/voice";
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
    // const response = await fetch(`https://semantle-ko.newsjel.ly/guess/${diffDays}/${encodeWord}`);
    const data = await response.json() as komentleResponseType;
    console.log(data);

    if (data.guess) {
        if (data.rank === "정답!") {
            return `축하드립니다! 정답을 맞췄습니다🎉\n유사도: ${data.sim?.toFixed(3) ?? "유사도를 찾지 못했습니다."}  |  순위: ${data.rank}`;
        } else {
            return `유사도: ${data.sim?.toFixed(3) ?? "유사도를 찾지 못했습니다."}  |  순위: ${data.rank}`;
        }
    } else {
        return data.detail?.description ?? "처리할 수 없는 입력입니다.";
    }
};

export const playMusic = async (cId: string, gId: string, ac: InternalDiscordGatewayAdapterCreator, url: string): Promise<string> => {
    const connection = joinVoiceChannel({
        channelId: cId,
        guildId: gId,
        adapterCreator: ac,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
        console.log(`<===== 음성 채널(${cId})에 성공적으로 연결되었습니다. =====>`);
    });

    const ytDlpProcess = spawn('yt-dlp', [
        '-q',
        '--no-warnings',
        '-f', 'bestaudio',
        '--extract-audio',
        '--audio-format', 'mp3',
        '--output', '-',
        url
    ]);

    // yt-dlp 프로세스 에러 메세지
    ytDlpProcess.on('error', (error) => {
        console.error(`yt-dlp 프로세스 실행 중 오류 발생: ${error.message}`);
        connection.destroy();
    });

    ytDlpProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`yt-dlp 프로세스가 비정상적으로 종료되었습니다. 종료 코드: ${code}`);
        }
    });

    const readableStream = new Readable().wrap(ytDlpProcess.stdout);

    // 스트림 오류 처리
    readableStream.on('error', (error) => {
        console.error(`오디오 스트림 오류: ${error.message}`);
        connection.destroy();
    });

    const resource = createAudioResource(readableStream);
    const player: AudioPlayer = createAudioPlayer();

    // 플레이어 오류 처리
    player.on('error', (error) => {
        console.error(`오디오 플레이어 오류: ${error.message}`);
        connection.destroy();
    });

    // 오디오 플레이어 상태 변화 처리
    player.on(AudioPlayerStatus.Idle, () => {
        console.log("재생이 완료되었습니다.");
        connection.destroy();
    });

    player.play(resource);
    connection.subscribe(player);

    return `현재 재생음악: ${url}`;
};
