#!/usr/bin/env bash
# exit on error
set -o errexit

# --- 디버깅을 위해 각 명령어 실행 전후로 로그를 추가하고, 변수 내용을 확인합니다. ---

echo "===== 1. Installing system dependencies... ====="
apt-get update
apt-get install -y ffmpeg python3-pip
echo "===== System dependencies installation complete. ====="

echo ""
echo "===== 2. Installing yt-dlp via pip... ====="
pip3 install -U yt-dlp --break-system-packages
echo "===== yt-dlp installation complete. ====="
echo ""
echo "===== 3. Finding executable paths... ====="
# which 명령어의 성공 여부를 확인하고, 실패 시 스크립트를 중단시킵니다.
YT_DLP_PATH=$(which yt-dlp || { echo "Error: 'which yt-dlp' failed. yt-dlp not found in PATH."; exit 1; })
FFMPEG_PATH=$(which ffmpeg || { echo "Error: 'which ffmpeg' failed. ffmpeg not found in PATH."; exit 1; })

echo "Found yt-dlp at: ${YT_DLP_PATH}"
echo "Found ffmpeg at: ${FFMPEG_PATH}"
echo "===== Executable paths found. ====="

echo ""
echo "===== 4. Creating .env file... ====="
# 기존 .env 파일이 있다면 삭제
rm -f .env
echo "YT_DLP_PATH=${YT_DLP_PATH}" > .env
echo "FFMPEG_PATH=${FFMPEG_PATH}" >> .env
echo "Content of .env file:"
cat .env
echo "===== .env file created. ====="

echo ""
echo "===== 5. Installing Node.js dependencies... ====="
npm install
echo "===== Node.js dependencies installation complete. ====="

echo ""
echo "===== 6. Running build command... ====="
npm run build
echo "===== Build command complete. ====="