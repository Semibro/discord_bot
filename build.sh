#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing system dependencies..."
apt-get update
# apt-get install -y yt-dlp ffmpeg # yt-dlp는 pip로 설치하는 것이 최신 버전을 유지하기에 더 좋습니다.
apt-get install -y ffmpeg python3-pip

echo "Installing yt-dlp via pip..."
pip3 install -U yt-dlp

echo "Installing Node.js dependencies..."
npm install

echo "Running build command..."
npm run build