#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing system dependencies..."
apt-get update
apt-get install -y ffmpeg python3-pip

echo "Installing yt-dlp via pip (bypassing external management check)..."
pip3 install -U yt-dlp --break-system-packages

echo "Installing Node.js dependencies..."
npm install

echo "Running build command..."
npm run build