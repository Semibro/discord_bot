#!/usr/bin/env bash
# exit on error
set -o errexit

echo "===== 1. 시스템 의존성 패키지 설치... ======"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ffmpeg python3 curl
echo "===== 시스템 의존성 패키지 설치 완료. ======"

echo ""
echo "===== 2. yt-dlp 바이너리 다운로드 및 권한 설정... ====="
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
chmod a+rx /usr/local/bin/yt-dlp
echo "===== yt-dlp 바이너리 다운로드 및 권한 설정 완료. ======"

echo ""
echo "===== 2. Node.js 의존성 설치... ======"
npm install
echo "===== Node.js 의존성 설치 완료. ======"

echo ""
echo "===== 3. 빌드 명령어 실행... ======"
npm run build
echo "===== 빌드 명령어 완료. ======"