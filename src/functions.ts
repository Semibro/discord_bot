import { InternalDiscordGatewayAdapterCreator } from "discord.js";
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    VoiceConnectionStatus,
    joinVoiceChannel,
    AudioPlayer,
    VoiceConnection,
} from "@discordjs/voice";
import { spawn } from "child_process";
import { Readable } from "stream";

type musicTrack = {
    url: string;
    title: string;
    duration?: string;
}

type musicQueueType = {
    tracks: musicTrack[];
    currentIndex: number;
    isPlaying: boolean;
    player?: AudioPlayer;
    connection?: VoiceConnection;
}

// Queue
const musicQueues = new Map<string, musicQueueType>();

const initializeQueue = (guildId: string): musicQueueType => {
    const queue: musicQueueType = {
        tracks: [],
        currentIndex: 0,
        isPlaying: false,
    };

    musicQueues.set(guildId, queue);
    return queue;
}

const getQueue = (guildId: string): musicQueueType => {
    let queue = musicQueues.get(guildId);
    if (!queue) {
        queue = initializeQueue(guildId);
    }
    return queue;
};

// 다음 곡 재생
const playNextTrack = async (guildId: string): Promise<void> => {
    const queue = getQueue(guildId);

    if (queue.currentIndex >= queue.tracks.length) {
        queue.isPlaying = false;
        if (queue.connection && queue.connection.state.status !== 'destroyed') {
            try {
                queue.connection.destroy();
            } catch (error) {
                console.log("연결이 이미 종료되었습니다.");
            }
        }
        return;
    }

    const track = queue.tracks[queue.currentIndex];

    try {
        if (!queue.connection || queue.connection.state.status === 'destroyed') {
            throw new Error("음성 연결이 없습니다.");
        }

        console.log("재생할 URL:", track.url);
        
        // spawn을 사용하여 yt-dlp로 스트림 생성
        const ytDlpProcess = spawn('./yt-dlp', [
            '-q',
            '--no-warnings',
            '-f', 'bestaudio',
            '--extract-audio',
            '--audio-format', 'mp3',
            '--output', '-',
            track.url
        ]);
        
        ytDlpProcess.on('error', (error) => {
            console.error(`yt-dlp 프로세스 실행 중 오류 발생: ${error.message}`);
            queue.currentIndex++;
            playNextTrack(guildId);
        });
        
        const readableStream = new Readable().wrap(ytDlpProcess.stdout);
        const resource = createAudioResource(readableStream);

        if (!queue.player) {
            queue.player = createAudioPlayer();
        }

        queue.player.on(AudioPlayerStatus.Idle, () => {
            console.log(`재생 완료 : ${track.title}`);
            queue.currentIndex++;
            playNextTrack(guildId);
        });

        queue.player.on("error", (error) => {
            console.error(`오디오 플레이어 오류 : ${error.message}`);
            queue.currentIndex++;
            playNextTrack(guildId);
        });

        queue.player.play(resource);
        queue.connection.subscribe(queue.player);
        queue.isPlaying = true;
    } catch (error) {
        console.error(`음악 재생 중 오류 : ${error}`);
        queue.currentIndex++;
        playNextTrack(guildId);
    }
};

// 음악 재생 관련 함수
export const addToQueue = async (
    cId: string,
    gId: string,
    ac: InternalDiscordGatewayAdapterCreator,
    url: string,
    title: string,
): Promise<string> => {
    const queue = getQueue(gId);

    // 연결이 없거나 종료된 상태라면 새로 생성
    if (!queue.connection || queue.connection.state.status === 'destroyed') {
        queue.connection = joinVoiceChannel({
            channelId: cId,
            guildId: gId,
            adapterCreator: ac,
        });

        queue.connection.on(VoiceConnectionStatus.Ready, () => {
            console.log(`<===== 음성 채널(${cId})에 성공적으로 연결되었습니다. =====>`);
        });
    }

    const newTrack: musicTrack = {
        url: url,
        title: title
    }

    queue.tracks.push(newTrack);

    if (!queue.isPlaying) {
        await playNextTrack(gId);
        return `🎵 **${title}** 을(를) 재생합니다!`;
    } else {
        return `🎵 **${title}** 을(를) 큐에 추가했습니다! (대기 중: ${queue.tracks.length - queue.currentIndex - 1}곡)`;
    }
};

export const getQueueStatus = (guildId: string): string => {
    const queue = getQueue(guildId);

    if (queue.tracks.length === 0) {
        return "📭 큐가 비어있습니다.";
    }

    let status = `📋 **음악 큐** (총 ${queue.tracks.length}곡)\n\n`;

    queue.tracks.forEach((track, index) => {
        const isCurrent = index === queue.currentIndex && queue.isPlaying;
        const prefix = isCurrent ? "▶️" : "⏸️";
        status += `${prefix} ${index + 1}. ${track.title}\n`;
    });

    if (queue.isPlaying) {
        status += `\n현재 재생 중: ${queue.tracks[queue.currentIndex]?.title}`;
    }

    return status;
};

export const skipTrack = (guildId: string): string => {
    const queue = getQueue(guildId);

    if (!queue.isPlaying || queue.tracks.length === 0) {
        return "❌ 현재 재생 중인 음악이 없습니다.";
    }

    const skippedTrack = queue.tracks[queue.currentIndex];
    queue.currentIndex++;

    if (queue.currentIndex >= queue.tracks.length) {
        queue.isPlaying = false;
        if (queue.connection && queue.connection.state.status !== 'destroyed') {
            try {
                queue.connection.destroy();
            } catch (error) {
                console.log("연결이 이미 종료되었습니다.");
            }
        }
        return `⏭️ **${skippedTrack.title}** 을(를) 건너뛰었습니다.\n📭 모든 곡이 재생 완료되었습니다.`;
    }

    playNextTrack(guildId);
    return `⏭️ **${skippedTrack.title}** 을(를) 건너뛰고 다음 곡을 재생합니다.`;
}

export const stopQueue = (guildId: string): string => {
    const queue = getQueue(guildId);

    if (!queue.isPlaying) {
        return "❌ 현재 재생 중인 음악이 없습니다.";
    }

    queue.tracks = [];
    queue.currentIndex = 0;
    queue.isPlaying = false;

    if (queue.player) {
        queue.player.stop();
        queue.player = undefined;
    }

    if (queue.connection && queue.connection.state.status !== 'destroyed') {
        try {
            queue.connection.destroy();
        } catch (error) {
            console.log("연결이 이미 종료되었습니다.");
        }
    }
    
    // 연결 객체도 초기화
    queue.connection = undefined;

    return "🛑 음악 재생이 중지되었습니다.";
}

// export const playMusic = async (cId: string, gId: string, ac: InternalDiscordGatewayAdapterCreator, url: string): Promise<string> => {
//     const connection = joinVoiceChannel({
//         channelId: cId,
//         guildId: gId,
//         adapterCreator: ac,
//     });

//     connection.on(VoiceConnectionStatus.Ready, () => {
//         console.log(`<===== 음성 채널(${cId})에 성공적으로 연결되었습니다. =====>`);
//     });

//     const ytDlpPath = process.env.YT_DLP_PATH;

//     if (!ytDlpPath) {
//         console.error("YT_DLP_PATH 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.");
//         return "Error : yt-dlp 경로에 문제가 발생했습니다.";
//     }
//     console.log(`Using yt-dlp from: ${ytDlpPath}`);

//     const ytDlpProcess = spawn(ytDlpPath, [
//         '-q',
//         '--no-warnings',
//         '-f', 'bestaudio',
//         '--extract-audio',
//         '--audio-format', 'mp3',
//         '--output', '-',
//         url
//     ]);

//     // yt-dlp 프로세스 에러 메세지
//     ytDlpProcess.on('error', (error) => {
//         console.error(`yt-dlp 프로세스 실행 중 오류 발생: ${error.message}`);
//         connection.destroy();
//     });

//     ytDlpProcess.on('close', (code) => {
//         if (code !== 0) {
//             console.error(`yt-dlp 프로세스가 비정상적으로 종료되었습니다. 종료 코드: ${code}`);
//         }
//     });

//     const readableStream = new Readable().wrap(ytDlpProcess.stdout);

//     // 스트림 오류 처리
//     readableStream.on('error', (error) => {
//         console.error(`오디오 스트림 오류: ${error.message}`);
//         connection.destroy();
//     });

//     const resource = createAudioResource(readableStream);
//     const player: AudioPlayer = createAudioPlayer();

//     // 플레이어 오류 처리
//     player.on('error', (error) => {
//         console.error(`오디오 플레이어 오류: ${error.message}`);
//         connection.destroy();
//     });

//     // 오디오 플레이어 상태 변화 처리
//     player.on(AudioPlayerStatus.Idle, () => {
//         console.log("재생이 완료되었습니다.");
//         connection.destroy();
//     });

//     player.play(resource);
//     connection.subscribe(player);

//     return `현재 재생음악: ${url}`;
// };
