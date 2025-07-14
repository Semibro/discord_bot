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
echo "===== 3. 실행 파일 경로 찾기... ====="
# pip가 yt-dlp를 어디에 설치했는지 직접 확인하여 경로를 조립합니다.
# 먼저, yt-dlp 라이브러리 본체의 위치를 확인합니다.
# 예: /opt/render/.local/lib/python3.11/site-packages
LOCATION=$(pip3 show yt-dlp | grep Location | awk '{print $2}')

# 실행 파일은 보통 라이브러리 위치의 상위 폴더 아래 bin/ 에 있습니다.
# 예: /opt/render/.local/bin/yt-dlp
YT_DLP_PATH="${LOCATION}/../bin/yt-dlp"

# ffmpeg는 표준 경로에 있으므로 which로 찾습니다.
FFMPEG_PATH=$(which ffmpeg)

# 만약을 위해, 조립된 경로에 파일이 실제로 존재하는지 확인합니다.
if [ ! -f "$YT_DLP_PATH" ]; then
    echo "오류: 예상 경로에서 yt-dlp 실행 파일을 찾을 수 없습니다: $YT_DLP_PATH
      "
    # 대체 수단으로 find 명령어를 사용해 다시 찾아봅니다.
    YT_DLP_PATH=$(find /opt/render/.local -name yt-dlp -type f | head -n 1)
    if [ -z "$YT_DLP_PATH" ]; then
        echo "치명적 오류: yt-dlp 실행 파일을 어디에서도 찾을 수 없습니다."
        exit 1
    fi
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