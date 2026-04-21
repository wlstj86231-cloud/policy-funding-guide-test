@echo off
chcp 65001 > nul
echo 🚀 웹사이트 변경사항을 깃허브에 전송합니다...

echo [1/3] 변경사항 감지 중...
git add .

echo [2/3] 업데이트 기록 중...
git commit -m "Auto-update: %date% %time%"

echo [3/3] 깃허브로 전송 중...
git push origin main

echo ✅ 전송이 완료되었습니다! 창을 닫아도 좋습니다.
pause
