// 심화 문제를 "아이디어 주고받기"로 푼다 — 소인수분해 동굴 "심화 문제 도전"의 5개 유형
//   완전제곱수 만들기 / 최대공약수·최소공배수가 주어진 두 수 / 약수의 개수로 식 풀기 / 나머지가 같은 수 / 나무 심기
// 4지선다 보기를 두지 않고, 문제 바로 아래에서 토로와 3단계로 푼 뒤, 4번 질문 "그럼 ○○이 될 수 있는 수는?"(확장 문제)을 이모지 버튼으로 연다.
// 단계는 두 가지 형식이다.
//   선택형: 학생이 실제로 헷갈리는 곳. 정답 1개 + 실제 오개념 오답 1~2개(+ 잘 모르겠어요). 선택하면 토로가 반례로 반응한다.
//   빈칸형: 헷갈림 없이 처음 알아야 하는 곳. 보기 없이 직접 쓴다. 허용 답을 정해 두고 흔한 오답에는 맞춤 안내를 준다. 두 번 틀리면 "모범 답 보기".
//          toroAiGrader(정원과 같은 규약)가 연결돼 있으면 목록에 없는 답을 AI에 보내고, 지금은 연결이 없다.
// 점수: 3단계를 끝까지 가면 +1P, 먼저(첫 시도에) 맞힌 단계가 2개 이상이면 +2P(정답 점수 1점). 확장 문제는 점수 없음.
// 문제 숫자는 매판 다르므로 문장은 q.data로 채운다. 유형별 설명·그림·확장은 아래 IDEA_TYPES에 있다.
var IDEA = null;   // 풀이 3단계 상태
var EXT = null;    // 확장 문제 상태
var IDEA_COLORS = ['#fbbf24', '#38bdf8', '#f472b6', '#4ade80'];
var IDEA_AI_TIMEOUT_MS = 15000;

function ideaTimes(p, e){ var a = []; for(var i = 0; i < e; i++) a.push(p); return a.join(' × '); }
function ideaShuffle(a){ a = a.slice(); for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function ideaDivisors(n){ var d = []; for(var i = 1; i <= n; i++) if(n % i === 0) d.push(i); return d; }
function ideaGcd(a, b){ return b === 0 ? a : ideaGcd(b, a % b); }

// ── 단계 만드는 도우미 ──
// 선택형: ok = 정답 보기 {text, react}, wrongs = 오답 보기들 [{text, react}], hint = "잘 모르겠어요"를 눌렀을 때, right = 정리
function C(ask, ok, wrongs, hint, right, extra){
  var opts = [{text: ok.text, react: ok.react, ok: true}].concat(wrongs.map(function(w){ return {text: w.text, react: w.react, ok: false}; }));
  return Object.assign({kind: 'choice', ask: ask, opts: opts, hint: hint, right: right}, extra || {});
}
// 빈칸형: fields = [{pre, post, accept:[문자열 또는 정규식], wide}], wrong = [{re, msg}] (적은 답에 맞는 안내), model = 모범 답
function B(ask, fields, wrong, model, right, extra){
  return Object.assign({kind: 'blank', ask: ask, fields: fields, wrong: wrong || [], model: model, right: right}, extra || {});
}
function ideaNorm(s){ return String(s == null ? '' : s).replace(/\s+/g, '').replace(/[.,!?。，]/g, '').replace(/(개씩|가지|그루|미터|쌍|개|번|씩|m)$/, '').toLowerCase(); }
function ideaFieldOk(f, v){
  var raw = String(v == null ? '' : v).replace(/\s+/g, ''), n = ideaNorm(v);
  return f.accept.some(function(a){ return a instanceof RegExp ? a.test(raw) : ideaNorm(a) === n; });
}

// ── 그림 ──
// 같은 수를 둘씩 짝지은 그림(완전제곱수). extra = 소인수 p를 더 곱한 개수
function ideaPairsHtml(d, p, extra, note){
  var ps = Object.keys(d.f).map(Number), h = '<div style="background:#0f1c33;border:1px solid #243b63;border-radius:12px;padding:10px;margin:0 0 10px"><div style="font-size:.76rem;color:#94a3b8;margin-bottom:6px">같은 수를 둘씩 짝지어 볼까요? (짝 = 같은 수 2개)</div><div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span style="font-size:.9rem;color:#cbd5e1;margin-right:2px">' + d.n + ' =</span>';
  ps.forEach(function(q, gi){
    var c0 = d.f[q], cnt = c0 + (q === p ? extra : 0), col = IDEA_COLORS[gi % IDEA_COLORS.length], pairs = Math.floor(cnt / 2), lone = cnt % 2;
    for(var i = 0; i < pairs; i++){
      var isNew = q === p && extra > 0 && i >= Math.floor(c0 / 2);
      h += '<span class="idp' + (isNew ? ' idp-new' : '') + '"><span class="idt' + (isNew ? ' idt-add' : '') + '" style="background:' + col + '">' + q + '</span><span class="idt' + (isNew ? ' idt-add' : '') + '" style="background:' + col + '">' + q + '</span></span>';
    }
    if(lone) h += '<span class="idp idp-lone"><span class="idt" style="background:' + col + '">' + q + '</span><span class="idt idt-ph">?</span></span>';
  });
  return h + '</div>' + (note ? '<div style="margin-top:8px;font-size:.82rem;line-height:1.7;color:#e2e8f0">' + note + '</div>' : '') + '</div>';
}
// 약수의 곱셈표(2의 0~a번 × 3의 0~b번). 칸 하나가 약수 하나
function ideaGridHtml(a, b, note, full){
  var h = '<div style="background:#0f1c33;border:1px solid #243b63;border-radius:12px;padding:10px;margin:0 0 10px"><div style="font-size:.76rem;color:#94a3b8;margin-bottom:6px">약수 = (2를 곱하는 횟수) × (3을 곱하는 횟수) 한 가지씩 짝지은 곱셈표 — 칸 하나가 약수 하나' + (full ? '' : ' (줄은 a번까지 이어져요)') + '</div><div style="overflow-x:auto"><table style="border-collapse:separate;border-spacing:3px;margin:0 auto"><tr><th></th>';
  for(var j = 0; j <= b; j++) h += '<th style="font-size:.78rem;color:#38bdf8;font-weight:normal;padding:2px 4px">3<sup>' + j + '</sup></th>';
  h += '</tr>';
  var rows = full ? a + 1 : 2;
  for(var i = 0; i < rows; i++){
    h += '<tr><th style="font-size:.78rem;color:#fbbf24;font-weight:normal;padding:2px 6px">2<sup>' + i + '</sup></th>';
    for(j = 0; j <= b; j++) h += '<td style="min-width:34px;height:28px;text-align:center;border-radius:8px;background:rgba(99,102,241,.22);border:1px solid #818cf8;font-size:.8rem;color:#e2e8f0">' + (Math.pow(2, i) * Math.pow(3, j)) + '</td>';
    h += '</tr>';
  }
  if(!full) h += '<tr><th style="font-size:.78rem;color:#fbbf24;font-weight:normal;padding:2px 6px">⋮</th><td colspan="' + (b + 1) + '" style="text-align:center;font-size:.78rem;color:#94a3b8">2<sup>a</sup>까지 계속…</td></tr>';
  return h + '</table></div>' + (note ? '<div style="margin-top:8px;font-size:.82rem;line-height:1.7;color:#e2e8f0">' + note + '</div>' : '') + '</div>';
}
// 직사각형 땅 둘레에 간격 G마다 나무를 심은 그림(모퉁이는 노란 점)
function ideaTreeHtml(w, h, G, note){
  var maxW = 280, maxH = 130, sc = Math.min(maxW / w, maxH / h), W = w * sc, H = h * sc, per = 2 * (w + h), cnt = per / G, dots = '';
  for(var k = 0; k < cnt; k++){
    var d = k * G, x, y;
    if(d <= w){ x = d; y = 0; } else if(d <= w + h){ x = w; y = d - w; } else if(d <= 2 * w + h){ x = w - (d - w - h); y = h; } else { x = 0; y = h - (d - 2 * w - h); }
    var corner = ((x === 0 || x === w) && (y === 0 || y === h));
    dots += '<circle cx="' + (12 + x * sc).toFixed(1) + '" cy="' + (12 + y * sc).toFixed(1) + '" r="' + (corner ? 5.5 : 4) + '" fill="' + (corner ? '#fbbf24' : '#4ade80') + '"/>';
  }
  return '<div style="background:#0f1c33;border:1px solid #243b63;border-radius:12px;padding:10px;margin:0 0 10px;text-align:center"><svg viewBox="0 0 ' + (W + 24).toFixed(0) + ' ' + (H + 24).toFixed(0) + '" style="width:100%;max-width:340px"><rect x="12" y="12" width="' + W.toFixed(1) + '" height="' + H.toFixed(1) + '" fill="rgba(74,222,128,.08)" stroke="#475569" stroke-width="1.5"/>' + dots + '</svg><div style="font-size:.8rem;color:#94a3b8">가로 ' + w + 'm · 세로 ' + h + 'm — ' + G + 'm마다 한 그루(노란 점: 모퉁이)</div>' + (note ? '<div style="margin-top:6px;font-size:.82rem;line-height:1.7;color:#e2e8f0">' + note + '</div>' : '') + '</div>';
}

// ── 유형별 구성 ──
// 각 유형: steps(q) = 풀이 3단계, ext(q) = 확장 문제(4번 질문) {intro, steps, finalHtml(W)}, secret(q) = 끝 화면의 정리·검산
var IDEA_TYPES = {};

// ① 완전제곱수 만들기: n에 자연수를 곱해 완전제곱수가 되게 하는 최솟값. 숫자 목록의 n은 모두 지수가 홀수인 소인수가 하나뿐이다.
IDEA_TYPES.perfect_sq = {
  ok: function(q){
    var f = q.data.f, ps = Object.keys(f).map(Number);
    return ps.filter(function(p){ return f[p] % 2 !== 0; }).length === 1 && ps.some(function(p){ return f[p] % 2 === 0; });
  },
  parts: function(q){
    var d = q.data, f = d.f, ps = Object.keys(f).map(Number), p = ps.filter(function(x){ return f[x] % 2 !== 0; })[0], r = ps.filter(function(x){ return f[x] % 2 === 0; })[0];
    return {d: d, f: f, p: p, e: f[p], r: r, er: f[r], n: d.n, m: d.minN};
  },
  steps: function(q){
    var t = this.parts(q), d = t.d, p = t.p, e = t.e, r = t.r, er = t.er, n = t.n, exp = Object.keys(t.f).map(Number).map(function(x){ return ideaTimes(x, t.f[x]); }).join(' × ');
    return [
      B('완전제곱수 36 = 2×2×3×3, 100 = 2×2×5×5처럼 풀어서 곱해 보세요. 같은 수가 몇 개씩 짝을 이룰까요?',
        [{post: '개씩', accept: ['2', '둘', '두', '이']}],
        [{re: /^(1|하나|한)/, msg: '1개씩이 아니야. 36 = 2×2×3×3에서 2가 몇 개 묶여 있고 3이 몇 개 묶여 있어?'}, {re: /^(3|4|셋|세|넷)/, msg: '2끼리, 3끼리 몇 개씩 모여 있는지 다시 세어 봐.'}],
        '2개씩(둘씩)', '완전제곱수는 풀어서 곱하면 같은 수가 모두 둘씩 짝이 지어져(짝이 없는 수가 하나도 없어).'),
      B(n + ' = ' + exp + '. 같은 수끼리 둘씩 짝을 지으면, 짝을 못 찾은 수는 무엇일까요?',
        [{accept: [String(p)]}],
        [{re: new RegExp('^' + r + '$'), msg: r + '는 ' + er + '개라서 둘씩 딱 맞아. 짝이 모자란 건 어느 수일까?'}],
        String(p), p + '가 ' + e + '개(홀수)라서 짝 없는 ' + p + ' 하나가 남아. 이 ' + p + '에게 짝을 만들어 줘야 해.',
        {visual: function(W){ return ideaPairsHtml(d, p, 0, '노란 점선 상자가 <b>짝을 못 찾은 ' + p + '</b>예요.'); }}),
      C('짝을 못 찾은 ' + p + '에게 짝을 만들어 주려면, ' + p + eul(p) + ' 몇 개 더 곱해야 할까요?',
        {text: '한 개요. ' + p + '가 ' + e + '개에서 ' + (e + 1) + '개가 되니까 모두 짝이 맞아요.', react: ideaTimes(p, e) + '에 ' + p + ' 하나를 더 곱하면 ' + ideaTimes(p, e + 1) + ', ' + p + '가 ' + (e + 1) + '개가 되어 둘씩 딱 맞아!'},
        [{text: '모든 수에 하나씩요. ' + p + '에도 ' + r + '에도 하나씩 더 곱하면 짝이 맞아요.', react: r + '는 이미 ' + er + '개로 둘씩 짝이 맞아. 거기에 하나를 더 곱하면 오히려 짝 없는 ' + r + '가 생겨!'},
         {text: '세 개요. ' + p + '를 세 개 더 곱하면 ' + p + '가 ' + (e + 3) + '개로 짝수 개가 돼요.', react: '짝수 개가 되는 건 맞아! 그런데 ' + p + ' 한 개만 더 곱해도 ' + (e + 1) + '개로 짝수야. 문제는 "가장 작은 n"이니까 한 개가 최소야.'}],
        '짝이 없는 ' + p + ' 하나가 외로워. 같은 ' + p + ' 하나만 더 있으면 어떻게 될까?',
        p + ' 하나만 더 곱하면 ' + p + '가 ' + (e + 1) + '개가 되어서 모두 둘씩 짝이 맞아. 그래서 최소 n = ' + d.minN + '이고, ' + n + ' × ' + d.minN + ' = ' + d.result + ' = ' + d.sqrtRes + '²이야.',
        {visual: function(W){
          var s = W.cur, extra = 0, note = '아직 곱하기 전이에요. ' + p + '가 ' + e + '개 → 짝 없는 ' + p + ' 하나가 남아 있어요.';
          if(s.picked !== null){
            if(s.picked === 'dk' || W.steps[W.i].opts[s.picked].ok){ extra = 1; note = '초록 상자가 새로 생긴 짝이에요. <b>짝 없는 수가 하나도 없어요! 🎉</b>'; }
            else if(W.steps[W.i].opts[s.picked].text.indexOf('세 개') === 0){ extra = 3; note = p + '가 ' + (e + 3) + '개가 되어 짝수 개예요. 그런데 한 개만 곱해도 되니 최소는 아니야.'; }
            else { extra = 1; note = r + '에도 하나 더 곱하면 ' + r + '가 ' + (er + 1) + '개가 되어 오히려 짝 없는 수가 생겨요.'; }
          }
          return ideaPairsHtml(d, p, extra, note);
        }})
    ];
  },
  ext: function(q){
    var t = this.parts(q), a = t.n, m = t.m, J = [3, 4, 5, 6][Math.floor(Math.random() * 4)], R, ks = [], rounds = [100, 150, 200, 250, 300, 400, 500].filter(function(v){ var k = 0; while(m * (k + 1) * (k + 1) <= v) k++; return k >= 3 && k <= 12; });
    if(rounds.length && Math.random() < .5){ R = rounds[Math.floor(Math.random() * rounds.length)]; J = 0; while(m * (J + 1) * (J + 1) <= R) J++; }
    else { var lo = m * J * J, hi = m * (J + 1) * (J + 1) - 1; R = lo + Math.floor(Math.random() * (hi - lo + 1)); }
    for(var j = 1; j <= J; j++) ks.push(m * j * j);
    var last = ks[ks.length - 1], sq = Math.round(Math.sqrt(a * last)), self = ks.indexOf(a) >= 0;
    return {title: '그럼 n이 될 수 있는 수는?', intro: '최소 n은 ' + m + ' 하나였지만, 같은 문제에서 가능한 n이 더 있어요.<br>' + a + ' × n이 완전제곱수가 되는 자연수 n 중에서 <b style="color:#fde68a">' + R + ' 이하</b>인 것은 모두 몇 개일까요?',
      J: J, R: R, ks: ks, steps: [
      C(a + ' × n이 완전제곱수가 되려면 n은 어떤 모양이어야 할까요?',
        {text: 'n = ' + m + ' × (제곱수)예요. 곧 ' + m + '×1, ' + m + '×4, ' + m + '×9, …', react: a + ' × ' + m + '이 이미 제곱수(' + (a * m) + ' = ' + Math.round(Math.sqrt(a * m)) + '²)라서, 거기에 제곱수(같은 수 둘씩)를 곱해도 계속 짝이 맞아.'},
        [{text: 'n은 ' + m + '의 배수면 아무거나 돼요. 곧 ' + m + ', ' + (2 * m) + ', ' + (3 * m) + ', …', react: (2 * m) + '도 ' + m + '의 배수인데 ' + a + ' × ' + (2 * m) + ' = ' + (a * 2 * m) + '은 제곱수가 아니야. 제곱수를 곱해야 해.'},
         {text: 'n은 제곱수면 아무거나 돼요. 곧 1, 4, 9, 16, 25, …', react: 'n = 1이면 ' + a + ' × 1 = ' + a + '은 제곱수가 아니야. ' + m + '을 꼭 곱해서 짝 없는 수를 채워야 해.'}],
        '가장 작은 n은 앞 문제에서 구한 ' + m + '이야. 거기에 ×4, ×9처럼 어떤 수를 곱해야 짝이 계속 맞을까?',
        'n = ' + m + '×1, ' + m + '×4, ' + m + '×9, … (최솟값 ' + m + '에 제곱수를 곱한 수)'),
      B(m + ' × j × j가 ' + R + ' 이하가 되는 가장 큰 자연수 j는 얼마일까요?',
        [{pre: 'j =', accept: [String(J)]}],
        [{re: new RegExp('^' + (J + 1) + '$'), msg: 'j = ' + (J + 1) + '이면 ' + m + ' × ' + (J + 1) + ' × ' + (J + 1) + ' = ' + (m * (J + 1) * (J + 1)) + '로 ' + R + '을 넘어.'}],
        'j = ' + J, 'j = 1, 2, …, ' + J + ' (' + (J + 1) + '부터는 ' + R + '을 넘음)'),
      B('그럼 ' + a + ' × n이 완전제곱수가 되는 n은 ' + R + ' 이하에서 모두 몇 개일까요?',
        [{post: '개', accept: [String(J)]}],
        [{re: new RegExp('^' + (J + 1) + '(개)?$'), msg: 'j = 0도 센 거 같아. j = 0이면 n = 0인데 n은 자연수여야 해. 0은 세지 않아.'}],
        J + '개', '모두 ' + J + '개 → n = ' + ks.join(', ') + '. ' + a + ' × ' + last + ' = ' + (a * last) + ' = ' + sq + '²이야.' + (self ? ' 참고로 n = ' + a + '도 이 가운데 하나야(' + a + ' × ' + a + ' = ' + (a * a) + '). 가능한 n 중 하나일 뿐, 가장 작은 n은 아니지.' : ''))
    ], finalHtml: function(W){ return '정답: <b style="color:#fde68a;font-size:1rem">' + J + '개</b> (n = ' + ks.join(', ') + ')<br>🔑 <b style="color:#fde68a">비밀</b>: ' + a + ' × n이 제곱수 ⇔ n = ' + m + ' × (제곱수)'; }};
  },
  secret: function(q){ var d = q.data; return '짝이 없는 수에게 짝을 하나씩 만들어 주면 최소야.<br>검산: ' + d.n + ' × ' + d.minN + ' = ' + d.result + ' = ' + d.sqrtRes + '²'; }
};

// ② 최대공약수·최소공배수가 주어진 두 수(합이 가장 작은 두 수)
IDEA_TYPES.lcm_gcd_pair = {
  ok: function(q){ return !!(q && q.data && q.data.g); },
  pairs: function(q){ // 곱이 L/g인 서로소 짝(작은 수 먼저)
    var d = q.data, Q = d.L / d.g, all = [], co = [];
    for(var x = 1; x * x <= Q; x++) if(Q % x === 0){ all.push([x, Q / x]); if(ideaGcd(x, Q / x) === 1) co.push([x, Q / x]); }
    return {Q: Q, all: all, co: co};
  },
  steps: function(q){
    var d = q.data, g = d.g, L = d.L, pr = this.pairs(q), Q = pr.Q, best = [d.a / g, d.b / g], s = best[0] + best[1], ans = d.a + ', ' + d.b;
    var step3;
    if(pr.co.length === 1){ // 서로소 짝이 하나뿐(곱이 소수): 보기 없이 쓴다
      step3 = B('a × b = ' + Q + '이고 a, b가 서로소인 짝은 무엇일까요? (작은 수를 먼저)', [{pre: '(a, b) = (', post: ',', accept: [String(best[0])], wide: false}, {post: ')', accept: [String(best[1])]}],
        [], '(' + best[0] + ', ' + best[1] + ')', '곱이 ' + Q + '(소수)인 서로소 짝은 (' + best[0] + ', ' + best[1] + ') 하나뿐이야. 그래서 두 수는 ' + g + '×' + best[0] + ' = ' + d.a + ', ' + g + '×' + best[1] + ' = ' + d.b + '.');
    } else {
      var wr = [{text: '(1, ' + Q + ')이 가장 작아요. 1이 들어 있으니까요.', react: '(1, ' + Q + ')도 서로소이고 곱이 ' + Q + '이지만 합이 ' + (1 + Q) + '이야. (' + best[0] + ', ' + best[1] + ')은 합이 ' + s + '로 더 작아.'}];
      pr.all.forEach(function(pq){
        if(ideaGcd(pq[0], pq[1]) > 1 && pq[0] !== 1){ var gg = ideaGcd(pq[0], pq[1]); wr.push({text: '(' + pq[0] + ', ' + pq[1] + ')이에요. 곱이 ' + Q + '이고 합이 ' + (pq[0] + pq[1]) + '이에요.', react: '(' + pq[0] + ', ' + pq[1] + ')은 ' + pq[0] + '과 ' + pq[1] + '의 공통 약수가 ' + gg + '이라서 서로소가 아니야. 그러면 두 수가 ' + (g * pq[0]) + ', ' + (g * pq[1]) + '이 되어 최대공약수가 ' + (g * gg) + '이 돼.'}); }
      });
      step3 = C('a × b = ' + Q + '이고 a, b가 서로소인 짝 중 합이 가장 작은 것은 어느 것일까요?',
        {text: '(' + best[0] + ', ' + best[1] + ')이에요. 합이 ' + s + '이고 둘의 공통 약수가 1뿐이에요.', react: '맞아! 그러면 두 수는 ' + g + '×' + best[0] + ' = ' + d.a + ', ' + g + '×' + best[1] + ' = ' + d.b + '이야.'},
        wr.slice(0, 2), 'a×b = ' + Q + '인 짝을 모두 써 보고, 그중 공통 약수가 1뿐인 것만 남겨서 합을 비교해 봐.',
        '서로소인 짝 (' + best[0] + ', ' + best[1] + ')이 합이 가장 작아. 두 수는 ' + g + '×' + best[0] + ' = ' + d.a + ', ' + g + '×' + best[1] + ' = ' + d.b + '.');
    }
    return [
      B('최대공약수가 ' + g + '이면 두 수는 ' + g + '×a, ' + g + '×b로 쓸 수 있어요. 이때 a와 b의 공통 약수는 몇 뿐일까요?', [{post: '뿐', accept: ['1', '일']}],
        [{re: new RegExp('^' + g + '$'), msg: g + '은 이미 밖으로 꺼냈어. a와 b에 남은 공통 약수는 몇일까?'}],
        '1뿐(서로소)', 'a와 b에 공통 약수가 더 남아 있으면 그만큼 최대공약수가 더 커져. 그래서 a와 b는 공통 약수가 1뿐인 서로소야.'),
      B('최소공배수 = ' + g + ' × a × b = ' + L + '이니까 a × b는 얼마일까요?', [{pre: 'a × b =', accept: [String(Q)]}],
        [{re: new RegExp('^' + L + '$'), msg: L + '은 ' + g + '까지 포함한 최소공배수야. ' + g + '×a×b = ' + L + '이니까 ' + L + '을 ' + g + '으로 나눠야 해.'}],
        String(Q), L + ' ÷ ' + g + ' = ' + Q + '이니까 a × b = ' + Q + '이야.'),
      step3
    ];
  },
  ext: function(q){
    var d = q.data, g = d.g, pr = this.pairs(q), Q = pr.Q, P = pr.all.length, Cn = pr.co.length;
    var list = pr.co.map(function(c){ return g * c[0] + ', ' + g * c[1]; });
    return {title: '그럼 두 수가 될 수 있는 쌍은?', intro: '합이 가장 작은 쌍(' + d.a + ', ' + d.b + ')만 찾았지만, 최대공약수 ' + g + ', 최소공배수 ' + d.L + '인 두 수는 더 있을 수 있어요.<br>가능한 두 수의 짝은 모두 몇 쌍일까요? (순서가 달라도 같은 쌍)',
      steps: [
        B('곱이 ' + Q + '인 두 자연수 (a, b)는 모두 몇 쌍일까요? (a ≤ b)', [{post: '쌍', accept: [String(P)]}],
          [{re: new RegExp('^' + Cn + '$'), msg: '서로소만 센 거 같아. 이 질문은 서로소가 아니어도 곱이 ' + Q + '이기만 하면 모두 세는 거야.'}],
          P + '쌍', Q + '의 약수로 짝을 지으면 ' + pr.all.map(function(p2){ return '(' + p2[0] + ', ' + p2[1] + ')'; }).join(', ') + ' → ' + P + '쌍.'),
        B('그중 a와 b가 서로소인 짝은 몇 쌍일까요? 서로소여야 최대공약수가 정확히 ' + g + '이 돼요.', [{post: '쌍', accept: [String(Cn)]}],
          [{re: new RegExp('^' + P + '$'), msg: '공통 약수가 있는 짝도 섞여 있어. 예를 들어 (' + (pr.all.filter(function(p2){ return ideaGcd(p2[0], p2[1]) > 1; })[0] || [2, 6]).join(', ') + ')은 공통 약수가 있어서 안 돼.'}],
          Cn + '쌍', '서로소인 짝은 ' + pr.co.map(function(c){ return '(' + c[0] + ', ' + c[1] + ')'; }).join(', ') + ' → 두 수는 ' + list.map(function(s2){ return '(' + s2 + ')'; }).join(', ') + '.')
      ], finalHtml: function(W){ return '정답: <b style="color:#fde68a;font-size:1rem">' + Cn + '쌍</b> → ' + list.map(function(s2){ return '(' + s2 + ')'; }).join(', ') + '<br>🔑 <b style="color:#fde68a">비밀</b>: 두 수 = ' + g + ' × (곱이 ' + Q + '인 서로소 짝)'; }, J: Cn, ks: list};
  },
  secret: function(q){ var d = q.data; return '두 수 = 최대공약수 × (서로소인 두 수). 곱이 L÷g인 서로소 짝 중 합이 가장 작은 걸 고르면 돼.<br>검산: ' + d.a + ', ' + d.b + '의 최대공약수 ' + ideaGcd(d.a, d.b) + ', 최소공배수 ' + (d.a * d.b / ideaGcd(d.a, d.b)); }
};

// ③ 약수의 개수로 a 구하기(2ᵃ × 3ᵇ의 약수가 target개)
IDEA_TYPES.div_eq = {
  ok: function(q){ return !!(q && q.data && q.data.target); },
  steps: function(q){
    var d = q.data, a = d.a, b = d.b, T = d.target, expr = '2<sup>a</sup> × 3<sup>' + b + '</sup>';
    return [
      C(expr + '의 약수는 2를 몇 번, 3을 몇 번 곱한 모양일까요?',
        {text: '2는 0번부터 a번까지, 3은 0번부터 ' + b + '번까지 곱해요.', react: '맞아! 안 곱하는 경우(0번)도 있어. 2를 0번, 3을 0번 곱하면 1도 약수지.'},
        [{text: '2는 1번부터 a번까지, 3은 1번부터 ' + b + '번까지 곱해요.', react: '1번부터라면 2도 3도 한 번은 곱해야 해서 약수 1이 빠져 버려. 1 = 2⁰×3⁰도 약수잖아? 안 곱하는 경우(0번)도 세야 해.'}],
        '약수 중에는 1도 있어. 1은 2와 3을 몇 번씩 곱한 걸까?', '2는 0번~a번, 3은 0번~' + b + '번 곱할 수 있어. (안 곱하는 0번도 한 가지!)'),
      C('그럼 약수는 모두 몇 개일까요? (2를 고르는 방법과 3을 고르는 방법을 짝지어 봐요)',
        {text: '(a+1) × ' + (b + 1) + '개예요. 2를 고르는 방법마다 3을 고르는 방법이 따로 있어요.', react: '맞아! 곱셈표의 칸 수가 약수의 개수야. 줄이 (a+1)개, 칸이 ' + (b + 1) + '개.'},
        [{text: '(a+1) + ' + (b + 1) + '개예요. 2를 고르는 방법과 3을 고르는 방법을 합쳐요.', react: '더하지 않고 곱해! 2를 고르는 방법 하나마다 3을 고르는 방법이 ' + (b + 1) + '가지씩 따로 있으니까, 표의 칸 수(줄 × 칸)가 약수 개수야.'},
         {text: 'a × ' + b + '개예요. 2는 a번, 3은 ' + b + '번 곱하니까요.', react: '안 곱하는 0번도 한 가지씩 세야 해서 a가 아니라 (a+1)가지, ' + b + '이 아니라 (' + b + '+1)가지야.'}],
        '곱셈표를 봐. 줄이 몇 개, 칸이 몇 개인지 세어 봐.', '약수의 개수 = (a+1) × ' + (b + 1) + '. 곱셈표의 칸 수와 같아.',
        {visual: function(W){ return ideaGridHtml(a, b, W.cur.picked !== null ? '줄은 (a+1)개, 칸은 ' + (b + 1) + '개 → 약수는 (a+1) × ' + (b + 1) + '개예요.' : '줄은 2의 횟수(0번~a번), 칸은 3의 횟수(0번~' + b + '번)예요.', false); }}),
      B('(a+1) × ' + (b + 1) + ' = ' + T + '이면 a는 얼마일까요?', [{pre: 'a =', accept: [String(a)]}],
        [{re: new RegExp('^' + (T / (b + 1)) + '$'), msg: T + '÷' + (b + 1) + ' = ' + (T / (b + 1)) + '은 a+1이야. a는 거기서 1을 빼야 해.'}],
        'a = ' + a, 'a + 1 = ' + T + ' ÷ ' + (b + 1) + ' = ' + (T / (b + 1)) + '이라서 a = ' + a + '. 검산: (' + a + '+1) × ' + (b + 1) + ' = ' + T + '개.',
        {visual: function(W){ var done = W.cur.solved || W.cur.revealed; return ideaGridHtml(a, b, done ? 'a = ' + a + '일 때의 표예요. 줄 ' + (a + 1) + '개 × 칸 ' + (b + 1) + '개 = <b>' + T + '개</b>' : '줄 수 (a+1)에 칸 수 ' + (b + 1) + eul(b + 1) + ' 곱하면 ' + T + '개가 돼요.', done); }})
    ];
  },
  ext: function(q){
    var d = q.data, T = d.target, pairs = [];
    for(var x = 2; x * x <= T; x++) if(T % x === 0){ pairs.push([x, T / x]); }
    var ord = [];
    pairs.forEach(function(p2){ ord.push([p2[0] - 1, p2[1] - 1]); if(p2[0] !== p2[1]) ord.push([p2[1] - 1, p2[0] - 1]); });
    var N = ord.length;
    return {title: '그럼 (a, b)가 될 수 있는 쌍은?', intro: '2<sup>a</sup> × 3<sup>' + d.b + '</sup>에서 a만 구했지만, 2<sup>a</sup> × 3<sup>b</sup>의 약수가 ' + T + '개가 되는 (a, b) 짝은 더 있어요.<br>a, b가 자연수일 때 가능한 (a, b)는 모두 몇 쌍일까요?',
      steps: [
        C('(a+1) × (b+1) = ' + T + '에서 a+1과 b+1은 어떤 수일까요?',
          {text: '곱이 ' + T + '인 두 수인데, 둘 다 2 이상이어야 해요.', react: 'a, b가 자연수(1 이상)라서 a+1, b+1은 2 이상이어야 해.'},
          [{text: '곱이 ' + T + '인 두 수면 돼요. 1과 ' + T + '도 괜찮아요.', react: 'a+1 = 1이면 a = 0이야. a는 자연수여야 하니까 0은 안 돼. 둘 다 2 이상이어야 해.'}],
          T + '의 약수를 두 수의 곱으로 나눠 봐. a와 b가 자연수니까 a+1은 몇 이상일까?', 'a+1과 b+1은 곱이 ' + T + '이고 둘 다 2 이상인 수야.'),
        B('곱이 ' + T + '인 두 수(둘 다 2 이상)로 나누어 (a+1, b+1)을 정할 때, (a, b)는 순서까지 구분해서 모두 몇 쌍일까요?', [{post: '쌍', accept: [String(N)]}],
          [{re: new RegExp('^' + pairs.length + '$'), msg: '(a, b)와 (b, a)는 서로 다른 쌍이야. 같은 수 둘이 아닌 경우는 두 번씩 세어 봐.'}],
          N + '쌍', '(a+1, b+1) = ' + ord.map(function(o){ return '(' + (o[0] + 1) + ', ' + (o[1] + 1) + ')'; }).join(', ') + ' → (a, b) = ' + ord.map(function(o){ return '(' + o[0] + ', ' + o[1] + ')'; }).join(', ') + ' → ' + N + '쌍.')
      ], finalHtml: function(W){ return '정답: <b style="color:#fde68a;font-size:1rem">' + N + '쌍</b> → (a, b) = ' + ord.map(function(o){ return '(' + o[0] + ', ' + o[1] + ')'; }).join(', ') + '<br>🔑 <b style="color:#fde68a">비밀</b>: 약수의 개수 = (a+1)×(b+1)'; }, J: N, ks: ord};
  },
  secret: function(q){ var d = q.data; return '약수의 개수 = (2의 횟수+1) × (3의 횟수+1).<br>검산: (' + d.a + '+1) × (' + d.b + '+1) = ' + (d.a + 1) * (d.b + 1) + '개'; }
};

// ④ 나머지가 같은 수(나머지를 빼고 최대공약수)
IDEA_TYPES.rem_gcd = {
  ok: function(q){ return !!(q && q.data && q.data.ans); },
  steps: function(q){
    var d = q.data, a = d.a, ra = d.ra, b = d.b, rb = d.rb, A = a - ra, Bn = b - rb, g = d.ans, gab = ideaGcd(a, b);
    return [
      C(a + '을 어떤 수로 나눴더니 ' + ra + '이 남아요. 딱 나누어떨어지게 하려면 어떻게 하면 될까요?',
        {text: '나머지 ' + ra + '을 빼요. ' + A + '은 그 수로 나누어떨어져요.', react: '맞아! ' + a + '에서 나머지 ' + ra + '을 빼면 ' + A + ', 그 수로 딱 나누어떨어져.'},
        [{text: '나머지 ' + ra + '을 더해요. ' + (a + ra) + '이 그 수로 나누어떨어져요.', react: '예를 들어 7을 3으로 나누면 1이 남아. 7+1 = 8은 3으로 나누면 또 2가 남아(8÷3 = 2…2). 나머지를 빼야 6 = 3×2로 딱 나누어떨어져.'}],
        '예를 들어 7을 3으로 나누면 1이 남아. 7에서 무엇을 빼면 3으로 나누어떨어질까?', a + '에서 나머지 ' + ra + '을 빼면 ' + A + '이 돼. ' + b + '도 나머지 ' + rb + '을 빼면 ' + Bn + '이 돼.'),
      C(A + '과 ' + Bn + '을 둘 다 나누어떨어지게 하는 수는 어떤 수일까요?',
        {text: A + '과 ' + Bn + '의 공약수예요. 가장 큰 수는 최대공약수예요.', react: '맞아! 둘을 모두 나누어떨어뜨리는 수는 공약수, 그중 가장 큰 수가 최대공약수야.'},
        [{text: A + '과 ' + Bn + '의 공배수예요. 둘의 배수가 되는 수예요.', react: '공배수는 ' + A + '과 ' + Bn + '의 배수라서 둘보다 커져. 우리가 찾는 건 둘을 나누어떨어뜨리는 수, 곧 공약수야.'},
         {text: a + '과 ' + b + '의 공약수예요. 처음 수를 그대로 쓰면 돼요.', react: a + '과 ' + b + '은 나머지가 남아서 나누어떨어지지 않아. 나머지를 뺀 ' + A + '과 ' + Bn + '으로 구해야 해. (참고: ' + a + '과 ' + b + '의 최대공약수는 ' + gab + ')'}],
        A + '과 ' + Bn + '을 모두 나누어떨어뜨리는 수가 어떤 수인지 말해 봐.', A + '과 ' + Bn + '의 공약수 중 가장 큰 수를 구하면 돼.'),
      B(A + '과 ' + Bn + '의 최대공약수는 얼마일까요? (나머지 ' + Math.max(ra, rb) + '보다 큰 수예요)', [{accept: [String(g)]}],
        [{re: new RegExp('^' + gab + '$'), msg: a + '과 ' + b + '의 최대공약수가 아니라, 나머지를 뺀 ' + A + '과 ' + Bn + '의 최대공약수야.'}],
        String(g), A + '과 ' + Bn + '의 최대공약수는 ' + g + '. 나머지 ' + Math.max(ra, rb) + '보다 크니까 가능해. 검산: ' + a + '÷' + g + ' = ' + Math.floor(a / g) + '…' + (a % g) + ', ' + b + '÷' + g + ' = ' + Math.floor(b / g) + '…' + (b % g) + '.')
    ];
  },
  ext: function(q){
    var d = q.data, g = d.ans, r = Math.max(d.ra, d.rb), cand = ideaDivisors(g).filter(function(x){ return x > r; }), K = cand.length;
    return {title: '그럼 나누는 수가 될 수 있는 수는?', intro: '가장 큰 수 ' + g + '만 찾았지만, ' + d.a + '을 나누면 ' + d.ra + ', ' + d.b + '을 나누면 ' + d.rb + '이 남는 수는 더 있을 수 있어요.<br>나누는 수가 될 수 있는 수는 모두 몇 개일까요?',
      steps: [
        C('나누는 수는 ' + g + '의 약수 중 어떤 수여야 할까요?',
          {text: g + '의 약수 중 나머지 ' + r + '보다 큰 수여야 해요.', react: '맞아! 나머지는 나누는 수보다 항상 작아야 하니까 나누는 수는 ' + r + '보다 커야 해.'},
          [{text: g + '의 약수는 아무거나 돼요. 1도 돼요.', react: '나누는 수가 ' + (r >= 1 ? 1 : 1) + '이면 나머지가 ' + d.ra + '일 수 없어. 나머지는 항상 나누는 수보다 작아서, 나누는 수는 ' + r + '보다 커야 해.'}],
          '예를 들어 나누는 수가 3이면 나머지로 나올 수 있는 수는 0, 1, 2뿐이야. 나머지 ' + r + '이 나오려면 나누는 수는 얼마보다 커야 할까?', '나누는 수는 ' + g + '의 약수이면서 나머지 ' + r + '보다 큰 수야.'),
        B(ideaDivisors(g).join(', ') + ' 중에서 ' + r + '보다 큰 수는 모두 몇 개일까요?', [{post: '개', accept: [String(K)]}],
          [{re: new RegExp('^' + ideaDivisors(g).length + '$'), msg: '약수 전체를 센 거 같아. ' + r + '보다 큰 수만 세어야 해.'}],
          K + '개', g + '의 약수 중 ' + r + '보다 큰 수는 ' + cand.join(', ') + ' → ' + K + '개.')
      ], finalHtml: function(W){ return '정답: <b style="color:#fde68a;font-size:1rem">' + K + '개</b> (' + cand.join(', ') + ')<br>🔑 <b style="color:#fde68a">비밀</b>: 나누는 수는 최대공약수의 약수이면서 나머지보다 커야 해'; }, J: K, ks: cand};
  },
  secret: function(q){ var d = q.data; return '나머지를 빼고(' + (d.a - d.ra) + ', ' + (d.b - d.rb) + ') 최대공약수를 구하면 돼.<br>검산: ' + d.a + '÷' + d.ans + ' = ' + Math.floor(d.a / d.ans) + '…' + (d.a % d.ans) + ', ' + d.b + '÷' + d.ans + ' = ' + Math.floor(d.b / d.ans) + '…' + (d.b % d.ans); }
};

// ⑤ 나무 심기(직사각형 둘레, 네 모퉁이에 반드시, 최소 그루 수)
IDEA_TYPES.tree_plant = {
  ok: function(q){ return !!(q && q.data && q.data.G); },
  steps: function(q){
    var d = q.data, w = d.w, h = d.h, G = d.G, per = d.peri, cnt = d.count, mn = Math.min(w, h), mx = Math.max(w, h), L = w * h / G;
    var bad = 0; for(var k = 2; k <= per; k++){ if(per % k === 0 && (w % k !== 0 || h % k !== 0)){ bad = k; break; } }
    return [
      C('네 모퉁이에 꼭 심고 간격을 일정하게 하려면, 간격은 어떤 수여야 할까요?',
        {text: w + 'm와 ' + h + 'm를 둘 다 나누어떨어뜨리는 수여야 해요(공약수).', react: '맞아! 가로 한 변, 세로 한 변이 모두 간격으로 딱 나누어떨어져야 모퉁이에 나무가 와.'},
        [{text: '둘레 ' + per + 'm를 나누어떨어뜨리는 수면 돼요.', react: '예를 들어 간격 ' + bad + 'm는 ' + per + '÷' + bad + ' = ' + (per / bad) + '로 나누어떨어지지만, ' + (w % bad !== 0 ? w + '÷' + bad : h + '÷' + bad) + '은 나누어떨어지지 않아서 모퉁이에 나무가 안 와.'},
         {text: w + 'm와 ' + h + 'm의 공배수여야 해요.', react: '공배수는 ' + w + 'm, ' + h + 'm보다 커져. 간격이 한 변보다 길 수는 없어. 한 변을 딱 나누어떨어뜨리는 공약수야.'}],
        '가로 ' + w + 'm에서 간격이 안 맞으면 모퉁이에 나무가 못 와. 세로도 마찬가지야. 두 변 모두 어떻게 되어야 할까?', '간격은 ' + w + '과 ' + h + '의 공약수여야 해(두 변을 모두 딱 나누어떨어뜨려야 해).'),
      C('나무를 가장 적게 심으려면 간격은 어떻게 하면 될까요?',
        {text: '간격을 가장 크게 해요. ' + w + '과 ' + h + '의 최대공약수 ' + G + 'm예요.', react: '맞아! 간격이 클수록 나무가 적게 필요해. 공약수 중 가장 큰 수인 최대공약수 ' + G + 'm야.'},
        [{text: '간격을 가장 크게 해요. 짧은 변 ' + mn + 'm만큼 띄우면 돼요.', react: mn + 'm 간격이면 긴 변 ' + mx + 'm는 ' + mx + '÷' + mn + ' = ' + (mx / mn).toFixed(1).replace(/\.0$/, '') + '이라 나누어떨어지지 않아. 모퉁이에 나무가 안 와.'},
         {text: '간격을 가장 크게 해요. 최소공배수 ' + L + 'm예요.', react: L + 'm는 한 변보다 훨씬 길어서 둘레 안에 나무를 심을 수가 없어. 간격은 두 변의 공약수 중에서 골라야 해.'}],
        '나무를 적게 심으려면 간격이 클수록 좋아. 공약수 중 가장 큰 수는 무엇이라고 부를까?', '간격은 가장 크게, ' + w + '과 ' + h + '의 최대공약수 ' + G + 'm야.',
        {visual: function(W){ return W.cur.picked !== null ? ideaTreeHtml(w, h, G, '간격 ' + G + 'm면 모든 변이 딱 나누어떨어져요.') : ''; }}),
      C('둘레 ' + per + 'm에 ' + G + 'm마다 심으면 모두 몇 그루일까요?',
        {text: per + ' ÷ ' + G + ' = ' + cnt + '그루예요. 한 바퀴 돌아 처음 자리로 오니까 더하지 않아요.', react: '맞아! 둘레는 한 바퀴 돌아서 마지막 자리가 처음 자리와 같아서 하나를 더하지 않아.'},
        [{text: per + ' ÷ ' + G + ' + 1 = ' + (cnt + 1) + '그루예요. 처음과 끝에 모두 심으니까 하나 더해요.', react: '직선이라면 맞아! 그런데 둘레는 한 바퀴 돌아 시작한 자리로 돌아와서 마지막 나무가 처음 나무와 같은 자리야. 겹치니까 더하지 않아.'}],
        '나무 ' + G + 'm 간격으로 한 바퀴를 돌아 처음 자리로 돌아오면, 마지막 자리는 처음 자리와 같을까 다를까?', '둘레 ' + per + ' ÷ 간격 ' + G + ' = ' + cnt + '그루야. (한 바퀴 돌아 처음 자리로 돌아와서 더하지 않아.)',
        {visual: function(W){ return W.cur.picked !== null ? ideaTreeHtml(w, h, G, '나무는 모두 <b>' + cnt + '그루</b>예요.') : ''; }})
    ];
  },
  ext: function(q){
    var d = q.data, G = d.G, per = d.peri, cd = ideaDivisors(G), K = cd.length;
    return {title: '그럼 간격이 될 수 있는 수는?', intro: '최소 그루 수를 구하려고 가장 큰 간격 ' + G + 'm만 찾았지만, 네 모퉁이에 나무가 오는 간격은 더 있어요.<br>간격이 될 수 있는 수는 모두 몇 개일까요?',
      steps: [
        C('간격이 될 수 있는 수는 ' + G + '과 어떤 관계일까요?',
          {text: G + '의 약수예요. 두 변의 공약수는 최대공약수의 약수예요.', react: '맞아! 두 변의 공약수는 모두 최대공약수 ' + G + '의 약수야.'},
          [{text: G + '의 배수예요. 곧 ' + G + ', ' + (2 * G) + ', ' + (3 * G) + ', …', react: (2 * G) + 'm 간격이면 ' + (d.w % (2 * G) !== 0 ? d.w + '÷' + (2 * G) : d.h + '÷' + (2 * G)) + '이 나누어떨어지지 않아. ' + G + 'm보다 큰 간격은 안 돼.'}],
          '간격은 ' + G + 'm보다 클 수 있을까? 작은 수들은 되는지 하나씩 생각해 봐.', '간격이 될 수 있는 수는 ' + G + '의 약수야(' + G + 'm보다 큰 간격은 안 돼).'),
        B(G + '의 약수는 모두 몇 개일까요?', [{post: '개', accept: [String(K)]}],
          [{re: new RegExp('^' + (K - 1) + '$'), msg: '1도 간격이 될 수 있어. 약수에는 1과 ' + G + ' 자신도 들어 있어.'}],
          K + '개', G + '의 약수: ' + cd.join(', ') + ' → ' + K + '개. 그루 수는 ' + cd.map(function(x){ return per / x; }).join(', ') + '그루.')
      ], finalHtml: function(W){ return '정답: <b style="color:#fde68a;font-size:1rem">' + K + '개</b> (' + cd.join(', ') + 'm)<br>🔑 <b style="color:#fde68a">비밀</b>: 간격은 두 변의 공약수 = 최대공약수의 약수'; }, J: K, ks: cd};
  },
  secret: function(q){ var d = q.data; return '간격은 가로·세로의 최대공약수, 그루 수 = 둘레 ÷ 간격.<br>검산: ' + d.peri + ' ÷ ' + d.G + ' = ' + d.count + '그루'; }
};

function ideaSpecFor(q){
  var t = q && IDEA_TYPES[q.subtype];
  return t && q.data && t.ok(q) ? t : null;
}
function ideaEligible(q){ return !!(ST.hardMode && ST.topic === 'prime' && ideaSpecFor(q)); }

// ── 단계 걷기 엔진(풀이 3단계 = main, 확장 문제 = ext 둘 다 같은 엔진) ──
function wkNew(steps){
  return {steps: steps, i: 0, right: 0, order: steps.map(function(st){ return st.kind === 'choice' ? ideaShuffle(st.opts.map(function(_, k){ return k; })) : null; }), cur: {picked: null, tries: 0, msg: '', solved: false, revealed: false, busy: false}};
}
function wkResolved(W){ var c = W.cur; return c.picked !== null || c.solved || c.revealed; }
function wkDotsHtml(W, theme, extraDot){
  var h = '', n = W.steps.length;
  for(var k = 0; k < n; k++){
    var done = k < W.i || (k === W.i && wkResolved(W)), cur = k === W.i && !wkResolved(W);
    h += '<span style="display:inline-block;width:' + (cur ? 24 : 12) + 'px;height:12px;border-radius:6px;margin:0 3px;background:' + (done ? theme.done : cur ? '#fde68a' : 'rgba(255,255,255,.18)') + '"></span>';
  }
  if(extraDot) h += '<span title="확장 문제" style="display:inline-block;width:12px;height:12px;border-radius:6px;margin:0 3px;background:' + (EXT && EXT.i >= EXT.steps.length ? '#ec4899' : 'rgba(236,72,153,.35)') + '"></span>';
  return '<div style="text-align:center;margin-bottom:10px">' + h + '</div>';
}
var WK_BTN = 'display:block;width:100%;text-align:left;margin-bottom:8px;border-radius:10px;padding:10px 12px;font-size:.84rem;line-height:1.6;cursor:pointer;color:#e2e8f0;';
function wkBodyHtml(W, which){
  var st = W.steps[W.i], c = W.cur, n = W.steps.length, h = '', resolved = wkResolved(W);
  if(st.visual) h += st.visual(W);
  h += '<div style="font-size:.9rem;color:#e2e8f0;line-height:1.8;margin-bottom:10px">🦕 ' + st.ask + '</div>';
  if(st.kind === 'choice'){
    W.order[W.i].forEach(function(k, pos){
      var o = st.opts[k], chosen = c.picked === k;
      h += '<button ' + (resolved ? 'disabled ' : '') + 'onclick="wkPick(\'' + which + '\',' + k + ')" style="' + WK_BTN + 'background:' + (chosen ? 'rgba(168,85,247,.28)' : 'rgba(255,255,255,.05)') + ';border:1px solid ' + (chosen ? '#a855f7' : 'rgba(255,255,255,.18)') + '">학생 ' + 'ABC'.charAt(pos) + ': "' + o.text + '"</button>';
    });
    h += '<button ' + (resolved ? 'disabled ' : '') + 'onclick="wkPick(\'' + which + '\',\'dk\')" style="' + WK_BTN + 'background:' + (c.picked === 'dk' ? 'rgba(168,85,247,.28)' : 'rgba(255,255,255,.05)') + ';border:1px solid ' + (c.picked === 'dk' ? '#a855f7' : 'rgba(255,255,255,.18)') + '">잘 모르겠어요 🤔</button>';
  } else {
    var inputs = st.fields.map(function(f, k){
      return '<span style="white-space:nowrap;color:#e2e8f0;font-size:.95rem">' + (f.pre ? f.pre + ' ' : '') + '<input id="wk-in-' + which + '-' + k + '" ' + (resolved ? 'disabled ' : '') + 'autocomplete="off" onkeydown="if(event.key===\'Enter\')wkSubmit(\'' + which + '\')" style="width:' + (st.fields.length > 1 ? '64px' : '110px') + ';background:#0f172a;border:2px solid ' + (c.solved ? '#10b981' : '#64748b') + ';color:#fde68a;border-radius:8px;padding:7px 8px;font-size:1rem;text-align:center;font-family:inherit" value="' + (c.vals && c.vals[k] != null ? String(c.vals[k]).replace(/"/g, '&quot;') : '') + '">' + (f.post ? ' ' + f.post : '') + '</span>';
    }).join(' &nbsp; ');
    h += '<div style="margin-bottom:10px;line-height:2.4">' + inputs + '</div>';
    if(c.msg && !resolved) h += '<div style="color:#fca5a5;font-size:.82rem;line-height:1.8;margin-bottom:10px">🤔 ' + c.msg + '</div>';
    if(!resolved){
      h += '<button id="wk-chk-' + which + '" ' + (c.busy ? 'disabled ' : '') + 'onclick="wkSubmit(\'' + which + '\')" style="display:block;width:100%;background:linear-gradient(135deg,#065f46,#10b981);border:none;color:#fff;border-radius:10px;padding:10px;font-family:Jua,sans-serif;font-size:.9rem;cursor:pointer;margin-bottom:8px">' + (c.busy ? '채점 중…' : (c.tries > 0 ? '다시 확인' : '확인')) + '</button>';
      if(c.tries >= 2) h += '<button onclick="wkReveal(\'' + which + '\')" style="display:block;width:100%;background:rgba(253,230,138,.1);border:1px solid rgba(253,230,138,.35);color:#fde68a;border-radius:10px;padding:8px;font-family:Jua,sans-serif;font-size:.84rem;cursor:pointer;margin-bottom:8px">💡 모범 답 보기</button>';
    }
  }
  if(resolved){
    var react = '', tag = '';
    if(st.kind === 'choice'){
      if(c.picked === 'dk'){ tag = '힌트'; react = st.hint; }
      else { var o = st.opts[c.picked]; tag = o.ok ? '오!' : '음~'; react = o.react; }
    } else if(c.solved){ tag = c.tries === 1 ? '맞아요!' : '이번엔 맞았어요!'; react = '정답: ' + st.model; }
    else { tag = '모범 답'; react = st.model; }
    h += '<div style="background:rgba(253,230,138,.08);border:1px solid rgba(253,230,138,.3);border-radius:10px;padding:10px;font-size:.84rem;color:#e2e8f0;line-height:1.8;margin-bottom:8px">🦕 <b style="color:#fde68a">' + tag + '</b> ' + react + '</div>'
      + '<div style="background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.3);border-radius:10px;padding:10px;font-size:.84rem;color:#e2e8f0;line-height:1.8;margin-bottom:10px">✅ <b style="color:#86efac">정리</b> ' + st.right + '</div>';
    if(which === 'main' && W.i === n - 1) h += ideaBottomCtaHtml();
    h += '<button onclick="wkNext(\'' + which + '\')" style="display:block;width:100%;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;color:#fff;border-radius:10px;padding:10px;font-family:Jua,sans-serif;font-size:.9rem;cursor:pointer">' + (W.i === n - 1 ? '끝내기 🏁' : '다음 →') + '</button>';
  } else if(which === 'main' && W.i === n - 1){
    h += ideaBottomCtaHtml();
  }
  return h;
}
function wkWalk(which){ return which === 'main' ? IDEA : EXT; }
// 선택
function wkPick(which, k){
  var W = wkWalk(which); if(!W || wkResolved(W)) return;
  var st = W.steps[W.i]; if(!st || st.kind !== 'choice' || (k !== 'dk' && !st.opts[k])) return;
  W.cur.picked = k;
  if(k !== 'dk' && st.opts[k].ok) W.right++;
  wkRender(which);
}
// 빈칸: 쓴 값 확인
function wkSubmit(which){
  var W = wkWalk(which); if(!W || wkResolved(W) || W.cur.busy || !W.steps[W.i] || W.steps[W.i].kind !== 'blank') return;
  var st = W.steps[W.i], c = W.cur, vals = st.fields.map(function(_, k){ var e = document.getElementById('wk-in-' + which + '-' + k); return e ? e.value : ''; });
  c.vals = vals;
  if(vals.some(function(v){ return !String(v).trim(); })){ c.msg = '✏️ 빈칸을 모두 써 주세요.'; wkRender(which); return; }
  c.tries++;
  if(st.fields.every(function(f, k){ return ideaFieldOk(f, vals[k]); })){ c.solved = true; if(c.tries === 1) W.right++; c.msg = ''; wkRender(which); return; }
  var joined = vals.join(' ').replace(/\s+/g, ''), wrong = (st.wrong || []).filter(function(w){ return w.re.test(joined) || w.re.test(String(vals[0]).replace(/\s+/g, '')); })[0];
  if(typeof window.toroAiGrader === 'function' && !wrong){
    c.busy = true; wkRender(which);
    var call = Promise.resolve().then(function(){ return window.toroAiGrader({question: st.ask.replace(/<[^>]*>/g, ''), solution: st.right.replace(/<[^>]*>/g, ''), key: st.model, answer: vals.join(' ')}); });
    var timeout = new Promise(function(res){ setTimeout(function(){ res(null); }, IDEA_AI_TIMEOUT_MS); });
    Promise.race([call, timeout]).catch(function(){ return null; }).then(function(res){
      c.busy = false;
      if(res && res.tier === 'full'){ c.solved = true; c.msg = ''; } else c.msg = '아쉬워요. 다시 한 번 생각해 볼까요?';
      wkRender(which);
    });
    return;
  }
  c.msg = wrong ? wrong.msg : '아쉬워요. 다시 한 번 생각해 볼까요?';
  wkRender(which);
}
function wkReveal(which){
  var W = wkWalk(which); if(!W || wkResolved(W)) return;
  W.cur.revealed = true; W.cur.msg = ''; wkRender(which);
}
function wkNext(which){
  var W = wkWalk(which); if(!W || !wkResolved(W)) return;
  if(W.i < W.steps.length - 1){ W.i++; W.cur = {picked: null, tries: 0, msg: '', solved: false, revealed: false, busy: false}; wkRender(which); return; }
  if(which === 'main') ideaFinish(); else extFinish();
}
function wkRender(which){
  var W = wkWalk(which); if(!W) return;
  if(which === 'main'){
    var box = document.getElementById('qc-idea'); if(!box || W.qi !== ST.cur) return;
    var n = W.steps.length, lab = '<div style="font-family:Jua,sans-serif;color:#d8b4fe;font-size:.78rem">' + (W.i + 1) + ' / ' + n + ' 단계</div>';
    var head = (W.i === n - 1) ? '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px">' + lab + ideaSideCtaHtml() + '</div>' : '<div style="margin-bottom:6px">' + lab + '</div>';
    box.innerHTML = '<div style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.35);border-radius:12px;padding:12px">' + wkDotsHtml(W, {done: '#a855f7'}, true) + head + wkBodyHtml(W, 'main') + '</div>';
  } else {
    var box2 = document.getElementById('qc-ext'); if(!box2 || W.qi !== ST.cur) return;
    var n2 = W.steps.length, intro = '';
    if(W.i === 0) intro = '<div style="background:rgba(236,72,153,.1);border:1px solid rgba(236,72,153,.35);border-radius:10px;padding:10px;font-size:.88rem;line-height:1.8;color:#e2e8f0;margin-bottom:10px"><b style="color:#fbcfe8">👑 ' + W.data.title + '</b><br>' + W.data.intro + '</div>';
    box2.innerHTML = '<div style="background:rgba(236,72,153,.07);border:1px solid rgba(236,72,153,.35);border-radius:12px;padding:12px">' + wkDotsHtml(W, {done: '#ec4899'}, false) + '<div style="font-family:Jua,sans-serif;color:#f0abfc;font-size:.78rem;margin-bottom:6px">🚀 4번 질문 · 확장 문제 (' + (W.i + 1) + ' / ' + n2 + ')</div>' + intro + wkBodyHtml(W, 'ext') + '</div>';
  }
  var st0 = W.steps[W.i];
  if(st0 && st0.kind === 'blank' && !wkResolved(W) && !W.cur.busy){ var f0 = document.getElementById('wk-in-' + which + '-0'); if(f0 && f0.focus) f0.focus(); }
}

// ── 풀이 3단계: 시작·끝 ──
function ideaFinalHtml(){
  var q = ST.qs[ST.cur], spec = ideaSpecFor(q), n = IDEA.steps.length;
  return '<div style="background:rgba(168,85,247,.08);border:1px solid rgba(168,85,247,.35);border-radius:12px;padding:12px">' + wkDotsHtml(IDEA, {done: '#a855f7'}, true)
    + '<div style="text-align:center;font-size:2rem;margin-bottom:4px">🎉</div>'
    + '<div style="text-align:center;font-family:Jua,sans-serif;color:#d8b4fe;font-size:1rem;margin-bottom:8px">아이디어를 끝까지 따라갔어요!</div>'
    + '<div style="font-size:.86rem;color:#e2e8f0;line-height:1.85;margin-bottom:10px">🔑 <b style="color:#fde68a">비밀 정리</b><br>' + spec.secret(q) + '<br><span style="color:#94a3b8;font-size:.78rem">' + n + '단계 중 ' + IDEA.right + '단계를 먼저 맞혔어요.</span></div>'
    + '<button onclick="ideaRestart()" style="display:block;width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#e2e8f0;border-radius:10px;padding:9px;font-family:Jua,sans-serif;cursor:pointer">🔄 처음부터 다시 (점수는 그대로)</button></div>';
}
function ideaFinish(){
  var q = ST.qs[ST.cur], good = IDEA.right >= 2, earn = good ? 2 : 1;
  IDEA.i = IDEA.steps.length;
  if(!IDEA.scored){
    IDEA.scored = true; ST.answered = true;
    if(good) ST.score++;
    ST.points += earn; updatePoints();
    document.getElementById('qc-result').innerHTML =
      '<div style="font-size:.95rem;color:var(--green);margin-bottom:8px">✅ 정답: <b style="color:var(--yellow)">' + q.answer + '</b></div>'
      + '<button id="qc-explain-btn" onclick="toggleQCExplain()" style="background:rgba(99,102,241,.2);border:1px solid #6366f1;color:#a5b4fc;border-radius:8px;padding:7px 16px;font-size:.85rem;cursor:pointer">📖 풀이 보기</button>';
    var fb = document.getElementById('feedback-area');
    fb.style.display = 'block'; fb.className = 'feedback ' + (good ? 'correct' : 'wrong');
    fb.innerHTML = '<div class="feedback-title">' + (good ? '🎉 잘했어! +' : '👏 수고했어! +') + earn + 'P</div>';
    document.getElementById('btn-next').style.display = '';
    document.getElementById('btn-skip').style.display = 'none';
  }
  document.getElementById('qc-idea').innerHTML = ideaFinalHtml();
}
function ideaRestart(){
  if(!IDEA) return;
  extClose(); EXT = null;
  IDEA.i = 0; IDEA.right = 0; IDEA.cur = {picked: null, tries: 0, msg: '', solved: false, revealed: false, busy: false};
  IDEA.order = IDEA.steps.map(function(st){ return st.kind === 'choice' ? ideaShuffle(st.opts.map(function(_, k){ return k; })) : null; });
  wkRender('main');
}
// 보기 4개를 만드는 renderQChoices 대신 이 자리에 아이디어 칸을 놓고 바로 시작한다
function ideaStart(){
  var q = ST.qs[ST.cur], spec = ideaSpecFor(q);
  ideaCss();
  document.getElementById('q-steps-wrap').innerHTML =
    '<div id="qc-idea" style="margin-top:12px"></div><div id="qc-result" style="margin-top:12px"></div>'
    + '<div id="qc-explain" style="display:none;margin-top:10px;background:rgba(99,102,241,.1);border-left:3px solid #6366f1;padding:12px 14px;border-radius:8px;font-size:.9rem;line-height:1.7;color:#c0d0e0"></div>';
  extClose(); EXT = null;
  IDEA = wkNew(spec.steps(q)); IDEA.qi = ST.cur; IDEA.scored = false;
  wkRender('main');
}

// ── 4번 질문: "그럼 ○○이 될 수 있는 수는?" (확장 문제) — 이모지 버튼을 누르면 전체 화면을 새로 연다 ──
var IDEA_FACES = ['🤩', '😎', '🤔', '😆', '🥳', '😮', '🧐', '😜'], ideaFi = 0;

function ideaCss(){
  if(document.getElementById('idx-css')) return;
  var st = document.createElement('style'); st.id = 'idx-css';
  st.textContent = '.idx-cta{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:linear-gradient(135deg,rgba(168,85,247,.25),rgba(236,72,153,.2));border:1px solid #c084fc;border-radius:16px;padding:12px 14px;color:#f5e9ff;cursor:pointer;font-family:Jua,sans-serif;margin:0 0 10px}'
    + '.idx-cta .txt{font-size:1rem;line-height:1.35}.idx-cta .txt small{display:block;font-family:"Nanum Gothic",sans-serif;font-size:.74rem;color:#e9d5ff;opacity:.85;margin-top:2px}'
    + '.idx-side{display:flex;align-items:center;gap:6px;background:linear-gradient(135deg,rgba(168,85,247,.25),rgba(236,72,153,.2));border:1px solid #c084fc;border-radius:16px;padding:4px 10px 4px 5px;color:#f5e9ff;cursor:pointer;font-family:Jua,sans-serif}'
    + '.idx-side .txt{font-size:.74rem;line-height:1.3;text-align:left}.idx-side .idx-lv{width:46px;height:46px}.idx-side .idx-lv .face{font-size:1.5rem}.idx-side .idx-lv .core{inset:4px}'
    + '.idx-lv{position:relative;flex:none;width:62px;height:62px;display:flex;align-items:center;justify-content:center}'
    + '.idx-lv .ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,#f472b6,#fbbf24,#4ade80,#38bdf8,#a78bfa,#f472b6);opacity:.9;animation:idxSpin 4s linear infinite,idxHue 7s linear infinite}'
    + '.idx-lv .core{position:absolute;inset:5px;border-radius:50%;background:#1e1b4b}'
    + '.idx-lv .face{position:relative;font-size:2rem;line-height:1;animation:idxPulse 1.9s ease-in-out infinite}'
    + '.idx-lv.idx-hop{animation:idxHop .9s ease-in-out}'
    + '@keyframes idxSpin{to{transform:rotate(360deg)}}@keyframes idxHue{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}}'
    + '@keyframes idxPulse{0%,100%{transform:scale(.88)}50%{transform:scale(1.28)}}'
    + '@keyframes idxHop{0%{transform:translateY(0) rotate(0)}18%{transform:translateY(-14px) rotate(-14deg)}36%{transform:translateY(0) rotate(10deg)}54%{transform:translateY(-8px) rotate(-8deg)}72%{transform:translateY(0) rotate(5deg)}100%{transform:translateY(0) rotate(0)}}'
    + '.idp{display:inline-flex;gap:3px;padding:4px 6px;border-radius:12px;background:rgba(99,102,241,.18);border:2px solid #818cf8}'
    + '.idp-lone{background:rgba(251,191,36,.12);border:2px dashed #fbbf24;animation:idxLone 1.2s ease-in-out infinite}.idp-new{border-color:#4ade80;background:rgba(74,222,128,.18)}'
    + '.idt{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Jua,sans-serif;font-size:1rem;color:#0f172a}'
    + '.idt-ph{background:transparent;border:2px dotted #fbbf24;color:#fbbf24}.idt-add{animation:idxPop .45s ease-out}'
    + '@keyframes idxPop{0%{transform:scale(.2)}70%{transform:scale(1.25)}100%{transform:scale(1)}}@keyframes idxLone{0%,100%{box-shadow:0 0 0 rgba(251,191,36,0)}50%{box-shadow:0 0 12px rgba(251,191,36,.7)}}'
    + '@media (prefers-reduced-motion:reduce){.idx-lv .ring,.idx-lv .face,.idx-lv.idx-hop,.idp-lone,.idt-add{animation:none}}';
  document.head.appendChild(st);
}
function ideaSideCtaHtml(){
  return '<button class="idx-side" onclick="extOpen()" title="확장 문제 열기"><span class="idx-lv"><span class="ring"></span><span class="core"></span><span class="face">🤩</span></span>'
    + '<span class="txt">🚀 확장 문제<br>도전!</span></button>';
}
function ideaBottomCtaHtml(){
  return '<button class="idx-cta" onclick="extOpen()" style="margin-top:4px"><span class="idx-lv"><span class="ring"></span><span class="core"></span><span class="face">🤩</span></span>'
    + '<span class="txt">🚀 ' + ideaExtLabel() + '<small>확장 문제 — 새 화면에서 가능한 수가 모두 몇 개인지 세어 봐요</small></span></button>';
}
function ideaExtLabel(){
  var q = ST.qs[ST.cur], t = q && q.subtype;
  return ({perfect_sq: '그럼 n이 될 수 있는 수는?', lcm_gcd_pair: '그럼 두 수가 될 수 있는 쌍은?', div_eq: '그럼 (a, b)가 될 수 있는 쌍은?', rem_gcd: '그럼 나누는 수가 될 수 있는 수는?', tree_plant: '그럼 간격이 될 수 있는 수는?'})[t] || '확장 문제 도전!';
}
function ideaHopNow(){
  var es = document.querySelectorAll('#qc-idea .idx-lv'); if(!es.length) return;
  Array.prototype.forEach.call(es, function(e){ e.classList.remove('idx-hop'); void e.offsetWidth; e.classList.add('idx-hop'); });
  setTimeout(function(){ Array.prototype.forEach.call(es, function(e){ e.classList.remove('idx-hop'); }); }, 950);
}

function extStart(){
  var q = ST.qs[ST.cur], spec = ideaSpecFor(q), data = spec.ext(q);
  EXT = wkNew(data.steps); EXT.qi = ST.cur; EXT.data = data;
  wkRender('ext');
}
// 이모지를 누르면 아래로 펼치지 않고 전체 화면을 새로 연다. 풀이 화면의 상태(IDEA)는 그대로 두고 "← 돌아가기"로 돌아온다
function extOpen(){
  if(!IDEA || IDEA.qi !== ST.cur || document.getElementById('idx-screen')) return;
  var sc = document.createElement('div'); sc.id = 'idx-screen';
  sc.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:9500;background:#0b1220;overflow:auto;padding:16px';
  sc.innerHTML = '<div style="max-width:1200px;margin:0 auto"><button onclick="extClose()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:#e2e8f0;border-radius:10px;padding:8px 14px;font-family:Jua,sans-serif;font-size:.9rem;cursor:pointer;margin-bottom:12px">← 돌아가기</button>'
    + '<div style="font-family:Jua,sans-serif;color:#f0abfc;font-size:1.05rem;margin:0 0 10px">🚀 확장 문제</div><div id="qc-ext"></div></div>';
  document.body.appendChild(sc); document.body.style.overflow = 'hidden';
  if(!EXT || EXT.qi !== ST.cur || EXT.i >= EXT.steps.length) extStart(); else wkRender('ext');
  sc.scrollTop = 0;
}
function extClose(){
  var sc = document.getElementById('idx-screen'); if(sc) sc.parentNode.removeChild(sc);
  document.body.style.overflow = '';
  if(IDEA && IDEA.qi === ST.cur){
    if(IDEA.i >= IDEA.steps.length) document.getElementById('qc-idea').innerHTML = ideaFinalHtml(); else wkRender('main');
  }
}
function extFinish(){
  var n = EXT.steps.length;
  EXT.i = n;
  document.getElementById('qc-ext').innerHTML = '<div style="background:rgba(236,72,153,.07);border:1px solid rgba(236,72,153,.35);border-radius:12px;padding:12px">' + wkDotsHtml(EXT, {done: '#ec4899'}, false)
    + '<div style="text-align:center;font-size:2rem;margin-bottom:4px">🎉</div>'
    + '<div style="text-align:center;font-family:Jua,sans-serif;color:#f0abfc;font-size:1rem;margin-bottom:8px">확장 문제까지 해냈어요!</div>'
    + '<div style="font-size:.88rem;color:#e2e8f0;line-height:1.85;margin-bottom:10px">' + EXT.data.finalHtml(EXT) + '<br><span style="color:#94a3b8;font-size:.78rem">' + n + '단계 중 ' + EXT.right + '단계를 먼저 맞혔어요.</span></div>'
    + '<div style="display:flex;gap:8px"><button onclick="extStart()" style="flex:1;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#e2e8f0;border-radius:10px;padding:9px;font-family:Jua,sans-serif;cursor:pointer">🔄 다시 하기</button>'
    + '<button onclick="extClose()" style="flex:1;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;color:#fff;border-radius:10px;padding:9px;font-family:Jua,sans-serif;cursor:pointer">← 풀이로 돌아가기</button></div></div>';
}

// ── 연결 ──
// 심화 모드 + 소인수분해 + 위 5개 유형은 보기 4개 대신 아이디어 칸을 쓴다(나머지·일반 모드는 그대로)
window.addEventListener('load', function(){
  if(typeof renderQChoices !== 'function') return;
  var orig = renderQChoices;
  renderQChoices = function(){
    if(ideaEligible(ST.qs[ST.cur])) ideaStart(); else orig();
  };
});
// 살아있는 이모지: 표정이 바뀌고(1.3초), 가끔 폴짝(4~8초마다). 크기·색은 CSS 애니메이션이 맡는다
window.addEventListener('load', function(){
  ideaCss();
  setInterval(function(){
    var fs = document.querySelectorAll('#qc-idea .idx-lv .face'); if(!fs.length) return;
    ideaFi = (ideaFi + 1 + Math.floor(Math.random() * 2)) % IDEA_FACES.length;
    Array.prototype.forEach.call(fs, function(f){ f.textContent = IDEA_FACES[ideaFi]; });
  }, 1300);
  (function schedule(){ setTimeout(function(){ ideaHopNow(); schedule(); }, 4000 + Math.random() * 4000); })();
});

// 바로가기(무작위라 찾기 어려워서): middle.html?demo=idea&t=유형 → 소인수분해 "심화 문제 도전"을 열고 첫 문제를 그 유형으로 놓는다
//   t = perfect_sq(기본) | lcm_gcd_pair | div_eq | rem_gcd | tree_plant
//   middle.html?demo=ext&t=유형 → 위와 같고, 풀이 3단계를 건너뛰어(쓰는 답은 모두 정답) 확장 문제가 열린 화면으로 간다
function ideaDemo(kind){
  var gens = {perfect_sq: 'genPerfectSquare', lcm_gcd_pair: 'genLCMGCDPair', div_eq: 'genDivisorEq', rem_gcd: 'genRemainderGCD', tree_plant: 'genTreePlant'};
  var m = /[?&]t=([a-z_]+)/.exec(location.search), t = m && gens[m[1]] ? m[1] : 'perfect_sq';
  startQuizHard('prime', 'prime-hub');
  ST.qs[0] = window[gens[t]](); ST.cur = 0; ST.answered = false; renderQ();
  if(kind === 'ext'){
    for(var k = 0; k < IDEA.steps.length; k++){
      var st = IDEA.steps[k];
      if(st.kind === 'choice') wkPick('main', 0); else { IDEA.cur.solved = true; IDEA.right++; }
      wkNext('main');
    }
    extOpen();
  }
}
window.addEventListener('load', function(){
  if(typeof startQuizHard !== 'function') return;
  if(/[?&]demo=idea(&|$)/.test(location.search)) ideaDemo('idea');
  else if(/[?&]demo=ext(&|$)/.test(location.search)) ideaDemo('ext');
});
