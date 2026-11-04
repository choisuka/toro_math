// 돌아가는 톱니 그림(서로소 이야기) — 소인수분해 하브루타 2/4 카드의 풀이 칸에서 쓴다.
// 풀이 칸은 innerHTML로 채워져 스크립트가 돌지 않으므로, 카드 글에는 <div class="gp" data-gp="번호"></div> 자리만 두고
// 풀이 칸이 열릴 때(toggleCVAnswer) 이 자리에 그림을 붙인다.
// 톱니는 동그란 구슬로 그린 그림이다(어느 톱니끼리 만나는지를 보여 주는 용도). 두 바퀴는 톱니 한 개씩 같은 속도로 맞물려 돈다.
var GP_CASES = [
  {a: {n: 2, names: ['가', '나'], owner: '동글이'}, b: {n: 3, names: ['1', '2', '3'], owner: '뭉실이'}, coprime: true},
  {a: {n: 2, names: ['가', '나'], owner: '동글이'}, b: {n: 4, names: ['1', '2', '3', '4'], owner: '네모'}, coprime: false}
];
var GP_AC = ['#fb923c', '#f472b6'], GP_BC = ['#9fd2f7', '#4ade80', '#facc15', '#2dd4bf'];
var GP_PALE = {'#9fd2f7': '#5aa0d6'};   // 파스텔 톱니색 → 도장판 열 제목에 쓰는 글자색
function gpLabel(color){ return GP_PALE[color] ? '#3b2a5c' : '#fff'; }
var GP_SPEED = 0.55;

function gpGcd(a, b){ return b ? gpGcd(b, a % b) : a; }
function gpEase(f){ if(f < .28) return 0; var u = (f - .28) / .72; return u * u * (3 - 2 * u); }
function gpT(x){ var m = Math.floor(x + 1e-9); return m + gpEase(x - m); }

function gpCss(){
  if(document.getElementById('gp-css')) return;
  var st = document.createElement('style'); st.id = 'gp-css';
  st.textContent = '.gp-emoji{display:inline-block;margin-left:4px;padding:0 7px;font-size:1.2rem;line-height:1.55;border-radius:50%;border:1px solid rgba(253,230,138,.55);background:rgba(253,230,138,.14);cursor:pointer;vertical-align:middle;animation:gpEmo 2.2s ease-in-out infinite}.gp-emoji.on{animation:none;background:rgba(253,230,138,.35)}'
    + '.gp-rb{display:inline-block;margin-left:6px;vertical-align:middle;font-family:Jua,"Nanum Gothic",sans-serif;font-size:.95rem;cursor:pointer;white-space:nowrap;background:linear-gradient(90deg,#ff5f6d,#ffc371,#fde047,#4ade80,#38bdf8,#a78bfa,#ff5f6d);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;animation:gpRb 3s linear infinite}'
    + '@keyframes gpRb{0%{background-position:0 0}100%{background-position:200% 0}}'
    + '@keyframes gpEmo{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}@media (prefers-reduced-motion:reduce){.gp-emoji,.gp-rb{animation:none}}'
    + '.gp{background:#faf7ff;color:#3b2a5c;border:2px solid #c4b5fd;border-radius:16px;padding:10px 8px;margin:10px 0 14px;font-family:Jua,"Nanum Gothic",sans-serif;font-size:.9rem;line-height:1.5}'
    + '.gp *{box-sizing:border-box}.gp .gp-title{text-align:center;font-size:.92rem;margin-bottom:4px}'
    + '.gp .gp-stage{background:#fff;border:2px solid #c4b5fd;border-radius:14px;padding:4px 2px;position:relative}.gp .gp-stage svg{width:50%;height:auto;display:block;margin:0 auto}'
    + '.gp .gp-now{position:absolute;left:8px;top:6px;font-size:.72rem;background:#8b5cf6;color:#fff;border-radius:10px;padding:1px 8px}'
    + '.gp .gp-ctl{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:8px 0}'
    + '.gp .gp-ctl button{font-family:inherit;font-size:.8rem;border:none;border-radius:10px;padding:7px 11px;cursor:pointer;background:#7c3aed;color:#fff}.gp .gp-ctl button.sec{background:#e5e7eb;color:#4b5563}'
    + '.gp .gp-chips{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;min-height:28px;margin-bottom:6px}'
    + '.gp .gp-chip{background:#fff;border:2px solid #c4b5fd;border-radius:10px;padding:1px 8px;font-size:.85rem;animation:gpPop .35s ease-out}.gp .gp-chip i{font-style:normal;font-size:.68rem;color:#6d28d9;margin-right:3px}.gp .gp-chip.again{border-color:#22c55e;background:#f0fdf4}'
    + '.gp .gp-board{text-align:center}.gp table{border-collapse:separate;border-spacing:3px;margin:0 auto}.gp th{font-size:.85rem;font-weight:normal;padding:1px 5px}'
    + '.gp td{width:38px;height:32px;text-align:center;border-radius:8px;background:#ede9fe;font-size:.9rem;color:#b4a7d6}.gp td.hit{background:#c4b5fd;color:#3b1d8a;animation:gpPop .35s ease-out}.gp td.never{background:#e5e7eb;color:#9ca3af}'
    + '.gp .gp-sum{text-align:center;font-size:.85rem;line-height:1.65;padding:8px;border-radius:12px;background:#f5f3ff;border:2px solid #c4b5fd;margin-top:6px}.gp .gp-sum.good{background:#ecfdf5;border-color:#86efac}.gp .gp-sum.bad{background:#fff1f2;border-color:#fda4af}'
    + '@keyframes gpPop{0%{transform:scale(.3)}70%{transform:scale(1.15)}100%{transform:scale(1)}}'
    + '@media (prefers-reduced-motion:reduce){.gp .gp-chip,.gp td.hit{animation:none}}';
  document.head.appendChild(st);
}

function gpMount(root, ci){
  var c = GP_CASES[ci]; if(!c) return;
  gpCss();
  var n = c.a.n * c.b.n / gpGcd(c.a.n, c.b.n), total = c.a.n * c.b.n;
  var s = 0, playing = false, last = 0, target = null, raf = null, recKey = '', boardKey = '';
  root.__gp = true;
  root.innerHTML = '<div class="gp-title">⚙️ ' + c.a.owner + '(톱니 ' + c.a.n + '개)와 ' + c.b.owner + '(톱니 ' + c.b.n + '개)가 돌아요</div>'
    + '<div class="gp-stage"><span class="gp-now"></span><div class="gp-svg"></div></div>'
    + '<div class="gp-ctl"><button class="gp-play">▶ 돌리기</button><button class="sec gp-step">한 번만 악수 ▶|</button><button class="sec gp-reset">처음부터 ⏮</button></div>'
    + '<div class="gp-chips"></div><div class="gp-board"></div><div class="gp-sum"></div>';
  var q = function(sel){ return root.querySelector(sel); };

  function pairAt(m){ return [m % c.a.n, m % c.b.n]; }
  function draw(t){
    var ta = 12, pitch = 110, rA = c.a.n * pitch / (2 * Math.PI), rB = c.b.n * pitch / (2 * Math.PI);
    var pad = ta + 8, cy = Math.max(rA, rB) + pad, cxA = rA + pad, cxB = cxA + rA + rB + 2 * ta, W = cxB + rB + pad, H = cy + Math.max(rA, rB) + pad + 22;
    var m = Math.round(t), pa = m % c.a.n, pb = m % c.b.n, near = Math.abs(t - m) < 0.12;
    function gear(cx, cnt, r, colors, names, hit, dir, owner){
      var g = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 4) + '" fill="#ede9fe" stroke="#a78bfa" stroke-width="3"/>';
      for(var k = 0; k < cnt; k++){
        var ang = (dir > 0 ? (t - k) * 360 / cnt : 180 - (t - k) * 360 / cnt) * Math.PI / 180, x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang), on = k === hit;
        g += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + ta + '" fill="' + colors[k % colors.length] + '" opacity="' + (on ? 1 : .6) + '" stroke="' + (on ? 'none' : '#fff') + '" stroke-width="1.5"' + (on ? ' style="filter:drop-shadow(0 0 5px rgba(124,58,237,.65))"' : '') + '/>'
          + '<text x="' + x.toFixed(1) + '" y="' + (y + 5).toFixed(1) + '" text-anchor="middle" font-size="14" font-family="Jua,sans-serif" fill="' + gpLabel(colors[k % colors.length]) + '" stroke="' + (GP_PALE[colors[k % colors.length]] ? 'none' : 'rgba(0,0,0,.25)') + '" stroke-width=".4">' + names[k] + '</text>';
      }
      g += '<circle cx="' + (cx - 8) + '" cy="' + (cy - 4) + '" r="2.8" fill="#3b2a5c"/><circle cx="' + (cx + 8) + '" cy="' + (cy - 4) + '" r="2.8" fill="#3b2a5c"/>'
        + '<path d="M' + (cx - 7) + ' ' + (cy + 6) + ' Q' + cx + ' ' + (cy + (near ? 15 : 11)) + ' ' + (cx + 7) + ' ' + (cy + 6) + '" fill="none" stroke="#3b2a5c" stroke-width="2.2" stroke-linecap="round"/>'
        + '<text x="' + cx + '" y="' + (cy + r + ta + 16) + '" text-anchor="middle" font-size="13" font-family="Jua,sans-serif" fill="#6d5a9c">' + owner + ' · 톱니 ' + cnt + '개</text>';
      return g;
    }
    var mid = (cxA + rA + cxB - rB) / 2;
    q('.gp-svg').innerHTML = '<svg viewBox="0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0) + '" xmlns="http://www.w3.org/2000/svg">'
      + gear(cxA, c.a.n, rA, GP_AC, c.a.names, pa, 1, c.a.owner) + gear(cxB, c.b.n, rB, GP_BC, c.b.names, pb, -1, c.b.owner)
      + '<text x="' + mid.toFixed(1) + '" y="' + (cy - ta - 6) + '" text-anchor="middle" font-size="' + (near ? 26 : 18) + '" opacity="' + (near ? 1 : .35) + '">🤝</text></svg>';
  }
  function records(count, again){
    var key = count + ':' + again; if(key === recKey) return; recKey = key;
    var h = '', i;
    for(i = 0; i < count && i < n; i++){ var p = pairAt(i); h += '<span class="gp-chip"><i>' + (i + 1) + '번째</i><b style="color:#e11d48">' + c.a.names[p[0]] + '</b> 🤝 <b style="color:#e11d48">' + c.b.names[p[1]] + '</b></span>'; }
    if(again){ var r = pairAt(n); h += '<span class="gp-chip again"><i>' + (n + 1) + '번째</i><b style="color:#16a34a">' + c.a.names[r[0]] + ' 🤝 ' + c.b.names[r[1]] + '</b> 처음 짝!</span>'; }
    q('.gp-chips').innerHTML = h || '<span style="color:#b9a784">아직 악수 전이에요</span>';
  }
  function board(count, done){
    var key = count + ':' + done; if(key === boardKey) return; boardKey = key;
    var first = {}, t, h;
    for(t = 0; t < n; t++){ var p = pairAt(t); if(first[p[0] + ',' + p[1]] === undefined) first[p[0] + ',' + p[1]] = t + 1; }
    h = '<table><tr><th></th>' + c.b.names.map(function(x, j){ return '<th style="color:' + (GP_PALE[GP_BC[j % GP_BC.length]] || GP_BC[j % GP_BC.length]) + '">' + x + '</th>'; }).join('') + '</tr>';
    for(var i = 0; i < c.a.n; i++){
      h += '<tr><th style="color:' + GP_AC[i % GP_AC.length] + '">' + c.a.names[i] + '</th>';
      for(var j = 0; j < c.b.n; j++){
        var f = first[i + ',' + j];
        h += f && f <= count ? '<td class="hit">' + f + '</td>' : (!f && done ? '<td class="never">✕</td>' : '<td>·</td>');
      }
      h += '</tr>';
    }
    q('.gp-board').innerHTML = '<div style="font-size:.74rem;color:#6d5a9c;margin-bottom:3px">🗒️ 만남 도장판 — 칸의 숫자는 처음 만난 악수 순서</div>' + h + '</table>';
  }
  function summary(done){
    var box = q('.gp-sum');
    if(!done){ box.className = 'gp-sum'; box.innerHTML = '돌아가면서 누구랑 악수하는지 잘 보세요! 👀'; return; }
    if(c.coprime){ box.className = 'gp-sum good'; box.innerHTML = '🎉 <b>' + n + '번 모두 새로운 짝</b>이었어요!<br>가능한 짝 ' + c.a.n + '×' + c.b.n + ' = <b>' + total + '쌍</b>을 <b>하나도 빠짐없이</b> 다 만났어요.<br>그리고 ' + (n + 1) + '번째에 처음 짝으로 돌아왔어요.'; }
    else { box.className = 'gp-sum bad'; box.innerHTML = '😢 ' + n + '번 만나고 처음 짝으로 돌아왔어요.<br>가능한 짝 ' + c.a.n + '×' + c.b.n + ' = <b>' + total + '쌍</b>인데 <b>' + n + '쌍만</b> 만났어요.<br>가는 1, 3번하고만, 나는 2, 4번하고만… 못 만나는 톱니가 생겼어요.'; }
  }
  function render(){
    var x = Math.min(s, n), t = gpT(x), count = Math.min(Math.floor(x + 1e-9) + 1, n), done = x >= n - 1e-9;
    draw(done ? n : t);
    q('.gp-now').textContent = done ? (n + 1) + '번째 — 처음 짝!' : count + '번째 악수';
    records(done ? n : count, done); board(done ? n : count, done); summary(done);
    q('.gp-play').textContent = done ? '🔄 다시 돌리기' : (playing ? '⏸ 멈추기' : '▶ 돌리기');
  }
  function tick(now){
    if(!playing || !root.isConnected || root.offsetParent === null){ playing = false; raf = null; if(root.isConnected) render(); return; }
    var dt = Math.min((now - last) / 1000, .1); last = now; s += GP_SPEED * dt;
    if(target !== null && s >= target){ s = target; target = null; playing = false; }
    if(s >= n){ s = n; playing = false; }
    render();
    raf = playing ? requestAnimationFrame(tick) : null;
  }
  function start(){ if(playing) return; playing = true; last = performance.now(); raf = requestAnimationFrame(tick); }
  function reset(){ s = 0; target = null; recKey = ''; boardKey = ''; }
  q('.gp-play').onclick = function(){
    if(s >= n - 1e-9) reset();
    if(playing){ playing = false; render(); return; }
    target = null; start();
  };
  q('.gp-step').onclick = function(){
    if(s >= n - 1e-9){ reset(); render(); return; }
    if(playing) return;
    target = Math.floor(s + 1e-9) + 1; start();
  };
  q('.gp-reset').onclick = function(){ playing = false; reset(); render(); };
  root.__gpState = function(){ return {s: s, playing: playing, n: n}; };
  root.__gpSet = function(x){ playing = false; s = x; recKey = ''; boardKey = ''; render(); };
  render();
}
function gpMountAll(){
  Array.prototype.forEach.call(document.querySelectorAll('#cv-ans-area .gp'), function(el){ if(!el.__gp) gpMount(el, +el.getAttribute('data-gp')); });
}
// 풀이의 톱니바퀴 설명 옆 이모지: 누르면 "뾰족이 이야기" 상자가 열리고(다시 누르면 닫힘), 열릴 때 그림을 붙인다
function gpStoryToggle(btn){
  var p = document.getElementById('gp-story'); if(!p) return;
  var show = p.style.display === 'none';
  p.style.display = show ? '' : 'none';
  btn.setAttribute('aria-expanded', show ? 'true' : 'false'); btn.classList.toggle('on', show);
  if(show) gpMountAll();
}
window.addEventListener('load', function(){
  gpCss();
  if(typeof toggleCVAnswer !== 'function') return;
  var orig = toggleCVAnswer;
  toggleCVAnswer = function(){ orig(); gpMountAll(); };
});
