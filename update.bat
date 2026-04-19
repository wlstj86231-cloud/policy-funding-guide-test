@echo off
set GIT_PATH=C:\Users\Administrator\.gemini\antigravity\scratch\mingit\cmd\git.exe
echo [1/3] 변경사항 감지 중...
%GIT_PATH% add .
echo [2/3] 업데이트 기록 중...
%GIT_PATH% commit -m "Auto-update: %date% %time%"
echo [3/3] 깃허브로 전송 중...
%GIT_PATH% push origin master --force
echo 완료되었습니다!
pause
