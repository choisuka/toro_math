#!/usr/bin/env node
// 1단계: 사진 입력 → 2단계: 서랍 추출
// 사용법: node extract-drawers.js <사진경로.jpg>
//
// .env에서 ANTHROPIC_API_KEY를 직접 파싱한다 (dotenv 패키지 설치 없이 동작하도록).

const fs = require('fs');
const path = require('path');
const https = require('https');

function loadEnv(envPath) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) loadEnv(envPath);

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey || apiKey.includes('여기에')) {
  console.error('오류: ANTHROPIC_API_KEY가 .env에 설정되지 않았습니다.');
  process.exit(1);
}

const imagePath = process.argv[2];
if (!imagePath) {
  console.error('사용법: node extract-drawers.js <사진경로>');
  process.exit(1);
}
if (!fs.existsSync(imagePath)) {
  console.error(`오류: 파일을 찾을 수 없습니다 — ${imagePath}`);
  process.exit(1);
}

const ext = path.extname(imagePath).toLowerCase();
const mediaTypeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const mediaType = mediaTypeMap[ext];
if (!mediaType) {
  console.error(`오류: 지원하지 않는 이미지 형식(${ext}). jpg/jpeg/png/webp만 가능.`);
  process.exit(1);
}

const imageB64 = fs.readFileSync(imagePath).toString('base64');

const promptText = `이 사진은 시중 수학 문제집의 한 단원 페이지입니다.

다음을 수행하세요:
1. 사진 속에 보이는 모든 문제를 각각 식별하세요 (번호나 위치로 구분).
2. 각 문제가 어떤 "서랍"(=풀이에 필요한 핵심 유형/패턴)을 쓰는지 분석하세요. 여러 문제가 같은 서랍을 쓸 수 있습니다 — 그런 경우 하나의 서랍으로 합쳐서 정리하세요.
3. 각 서랍마다 다음을 정리하세요:
   - 서랍 이름 (짧고 명확하게)
   - 이 서랍을 알아보는 신호 (문제에 어떤 표현/조건이 나오면 이 서랍인지)
   - 필요한 도구/공식
   - 이 서랍을 쓰는 문제 번호(사진 속 몇 번 문제인지)

사진이 흐릿하거나 일부 문제가 안 보이면, 안 보인다고 명시하고 보이는 부분만 분석하세요. 추측으로 문제 내용을 지어내지 마세요.

출력은 다음 JSON 형식으로만 답하세요(다른 설명 없이):
{
  "감지된_문제_수": 숫자,
  "서랍_목록": [
    { "이름": "...", "인식_신호": "...", "필요한_도구": "...", "해당_문제번호": [1,2] }
  ],
  "읽기_어려운_부분": "없음 또는 설명"
}`;

const payload = JSON.stringify({
  model: 'claude-sonnet-5',
  max_tokens: 2048,
  messages: [{
    role: 'user',
    content: [
      { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageB64 } },
      { type: 'text', text: promptText }
    ]
  }]
});

const options = {
  hostname: 'api.anthropic.com',
  path: '/v1/messages',
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(payload)
  }
};

console.log(`이미지 전송 중... (${imagePath}, ${(imageB64.length / 1024).toFixed(0)}KB base64)`);

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`API 오류 (HTTP ${res.statusCode}):`, body);
      process.exit(1);
    }
    const json = JSON.parse(body);
    const text = json.content?.[0]?.text ?? '(응답 없음)';
    console.log('\n=== 서랍 추출 결과 ===\n');
    console.log(text);
    console.log('\n=== 사용 토큰 ===');
    console.log(`입력: ${json.usage?.input_tokens}, 출력: ${json.usage?.output_tokens}`);
  });
});

req.on('error', (e) => {
  console.error('요청 실패:', e.message);
  process.exit(1);
});

req.write(payload);
req.end();
