#!/usr/bin/env bash
 # exit on error
set -o errexit

echo "Installing system dependencies..."
apt-get update
apt-get install -y ffmpeg python3-pip

echo "Installing yt-dlp via pip..."
pip3 install -U yt-dlp --break-system-packages

echo "Finding yt-dlp path and creating .env file..."
# 'which' command finds the full path of the executable
YT_DLP_PATH=$(which yt-dlp)
echo "yt-dlp found at: ${YT_DLP_PATH}"
# Create a .env file with the path for the runtime environment
echo "YT_DLP_PATH=${YT_DLP_PATH}" > .env
# Also add ffmpeg path, just in case
FFMPEG_PATH=$(which ffmpeg)
echo "FFMPEG_PATH=${FFMPEG_PATH}" >> .env

echo "Installing Node.js dependencies..."
npm install

echo "Running build command..."
npm run build