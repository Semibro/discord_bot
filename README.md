# 준형봇 (Discord Bot)

Discord에서 다양한 기능을 제공하는 다목적 봇입니다. AI 챗봇, 음악 재생, YouTube 검색 등의 기능을 제공합니다.

## 🚀 주요 기능

### 1. AI 챗봇 (GPT)
- `질문? 내용` - GPT를 통한 대화형 AI 응답
- 친근하고 따뜻한 어조로 정확하고 자세한 답변 제공
- 대화 맥락을 이해하고 자연스러운 대화 진행

### 2. 음악 재생 시스템
- `음악? 노래 제목` - YouTube에서 음악 검색 및 재생
- `재생목록?` - 현재 재생목록 확인
- `다음곡?` - 다음 곡으로 건너뛰기
- `정지?` - 모든 음악 재생 중지

### 3. YouTube 검색
- `유튜브? 검색어` - YouTube 동영상 검색 및 링크 제공

### 4. 기타 기능
- `당근?` - 당근 이모지로 메시지 가리기
- `사용법?` - 봇 사용법 안내

## 🛠️ 기술 스택

- **Language**: TypeScript
- **Runtime**: Node.js
- **Discord API**: discord.js v14
- **Voice**: @discordjs/voice
- **AI**: OpenAI GPT API
- **Music**: yt-dlp
- **YouTube**: youtube-search-api

## 📋 설치 및 설정

### 1. 필수 요구사항
```bash
# yt-dlp 설치 (음악 재생용)
brew install yt-dlp

# ffmpeg 설치 (오디오 처리용)
brew install ffmpeg
```

### 2. 프로젝트 클론 및 의존성 설치
```bash
git clone <repository-url>
cd discord_bot
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Discord Bot 설정
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=your_channel_id

# OpenAI API 설정
GPT_API_KEY=your_openai_api_key
GPT_MODEL=gpt-3.5-turbo

# YouTube 설정 (선택사항)
YOUTUBE_COOKIE=your_youtube_cookie
```

### 4. Discord Bot 생성 및 설정
1. [Discord Developer Portal](https://discord.com/developers/applications)에서 새 애플리케이션 생성
2. Bot 섹션에서 토큰 생성
3. 다음 권한들을 활성화:
   - Send Messages
   - Use Slash Commands
   - Connect
   - Speak
   - Use Voice Activity

## 🚀 실행 방법

### 개발 모드
```bash
npm run dev
```

### 프로덕션 모드
```bash
build.sh
```

## 📦 배포 (Railway)

Railway에서 배포할 때는 다음 환경 변수를 설정하세요:

- `DISCORD_BOT_TOKEN`
- `DISCORD_CHANNEL_ID`
- `GPT_API_KEY`
- `GPT_MODEL` (선택사항, 기본값: gpt-3.5-turbo)

## 🎵 음악 재생 시스템

### 큐 시스템
- **자동 재생**: 첫 번째 곡이 끝나면 자동으로 다음 곡 재생
- **재생목록 관리**: 여러 곡을 순서대로 추가 가능
- **상태 표시**: 현재 재생 중인 곡과 대기 중인 곡 목록 확인
- **제어 기능**: 건너뛰기, 정지 기능 제공

## 🤖 AI 챗봇 기능

### 특징
- **친근한 대화**: 따뜻하고 친근한 어조로 응답
- **맥락 이해**: 이전 대화 내용을 고려한 자연스러운 대화
- **정확한 답변**: 신뢰할 수 있는 정보 제공
- **토큰 관리**: 사용량 모니터링 및 표시

## 🔧 프로젝트 구조

```
src/
├── index.ts          # 메인 진입점
├── discord.ts        # Discord 봇 핵심 로직
├── functions.ts      # 음악 재생 및 큐 관리
├── gpt.ts           # OpenAI GPT API 연동
├── youtube.ts       # YouTube 검색 기능
└── env.ts           # 환경 변수 관리
```

## 🐛 문제 해결

### 음악이 재생되지 않는 경우
1. yt-dlp가 올바르게 설치되었는지 확인
2. ffmpeg가 설치되어 있는지 확인
3. 음성 채널에 접속되어 있는지 확인

### 봇이 응답하지 않는 경우
1. Discord Bot 토큰이 올바른지 확인
2. 봇이 서버에 초대되었는지 확인
3. 필요한 권한이 부여되었는지 확인

## 📝 라이선스

ISC License