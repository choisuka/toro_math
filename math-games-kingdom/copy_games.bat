@echo off
chcp 65001 >nul
echo ╔══════════════════════════════════════╗
echo ║     수학 게임 왕국 - 파일 복사       ║
echo ╚══════════════════════════════════════╝
echo.

set "HUB=%~dp0"
set "BASE=C:\Users\USER"

echo [1/4] 수학 왕국 (Phaser) 복사 중...
copy /Y "%BASE%\math_game\phaser_game.html" "%HUB%games\math_kingdom.html" >nul
if errorlevel 1 (echo    ❌ 실패: math_game\phaser_game.html) else (echo    ✓ 복사 완료)

echo [2/4] 대수 탐험대 복사 중...
copy /Y "%BASE%\algebra_game\algebra_game.html" "%HUB%games\algebra.html" >nul
if errorlevel 1 (echo    ❌ 실패) else (echo    ✓ 복사 완료)

echo [3/4] 수학 탐정 복사 중...
copy /Y "%BASE%\detective_math\detective_game.html" "%HUB%games\detective.html" >nul
if errorlevel 1 (echo    ❌ 실패) else (echo    ✓ 복사 완료)

echo [4/4] 그래프 탐험대 복사 중...
copy /Y "%BASE%\graph_game\graph_game.html" "%HUB%games\graph.html" >nul
if errorlevel 1 (echo    ❌ 실패) else (echo    ✓ 복사 완료)

echo.
echo [5/5] math_kingdom.html 내부 링크 수정 중 (Flask 경로 → 상대경로)...
powershell -NoProfile -Command ^
  "(Get-Content '%HUB%games\math_kingdom.html' -Encoding UTF8) ^
   -replace 'href=\"/games/algebra\"', 'href=\"algebra.html\"' ^
   -replace 'href=\"/games/detective\"', 'href=\"detective.html\"' ^
   -replace 'href=\"/games/graph\"', 'href=\"graph.html\"' ^
   | Set-Content '%HUB%games\math_kingdom.html' -Encoding UTF8"
if errorlevel 1 (echo    ❌ 링크 수정 실패) else (echo    ✓ 링크 수정 완료)

echo.
echo [아이콘 생성]
echo    아이콘 PNG를 자동 생성합니다...
python "%HUB%make_icons.py"
if errorlevel 1 (
  echo    ⚠️  Python 아이콘 생성 실패. icons\ 폴더에 수동으로 192x192, 512x512 PNG를 넣으세요.
) else (
  echo    ✓ 아이콘 생성 완료
)

echo.
echo ════════════════════════════════════════
echo ✅ 모든 준비 완료!
echo.
echo 다음 단계:
echo   1. 브라우저에서 https://app.netlify.com/drop 열기
echo   2. games_hub 폴더를 드래그 앤 드롭
echo   3. 배포된 URL을 네이버 블로그에 링크
echo ════════════════════════════════════════
echo.
pause
