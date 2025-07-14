#!/usr/bin/env bash
# exit on error
set -o errexit

echo "===== 1. 시스템 의존성 패키지 설치... ====="
apt-get update
apt-get install -y ffmpeg python3-pip
echo "===== 시스템 의존성 패키지 설치 완료. ====="

echo ""
echo "===== 2. pip를 사용하여 yt-dlp 설치... ====="
pip3 install -U yt-dlp --break-system-packages
echo "===== yt-dlp 설치 완료. ====="

echo ""
echo "===== 3. 실행 파일 경로 찾기 (전체 시스템 검색)... ====="
# 서버 전체에서 'yt-dlp' 파일을 찾습니다. 2>/dev/null은 권한 오류를 숨깁니다.
YT_DLP_PATH=$(find / -name yt-dlp -type f 2>/dev/null | head -n 1)

# ffmpeg는 표준 경로에 있으므로 which로 찾습니다.
FFMPEG_PATH=$(which ffmpeg)

# 전체 검색 후에도 파일 경로를 찾지 못했는지 확인합니다.
if [ -z "$YT_DLP_PATH" ]; then
    echo "치명적 오류: 'find / -name yt-dlp' 명령어로도 실행 파일을 찾을 수 없습니다."
    exit 1
fi

echo "yt-dlp 경로: ${YT_DLP_PATH}"
echo "ffmpeg 경로: ${FFMPEG_PATH}"
echo "===== 실행 파일 경로 찾기 완료. ====="

echo ""
echo "===== 4. .env 파일 생성... ====="
rm -f .env
echo "YT_DLP_PATH=${YT_DLP_PATH}" > .env
echo "FFMPEG_PATH=${FFMPEG_PATH}" >> .env
echo ".env 파일 내용:"
cat .env
echo "===== .env 파일 생성 완료. ====="

echo ""
echo "===== 5. Node.js 의존성 설치... ====="
npm install
echo "===== Node.js 의존성 설치 완료. ====="

echo ""
echo "===== 6. 빌드 명령어 실행... ====="
npm run build
echo "===== 빌드 명령어 완료. ====="