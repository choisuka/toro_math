// 일차방정식 "뜻" 묶음 — 카드 4 "방정식이란 무엇인가?" 놀이판
// 원본 문장 6개(교재 eq-havruta-lesson "1. 탐구 — 등식이란 무엇인가")를 한 줄씩 잇고,
// x에 수를 넣어 참/거짓을 보는 장치 두 대를 둔다. 저장하거나 포인트를 쓰지 않는다(toro_* 키 없음).
// 카드 데이터에 fun:'eqmean' 이 있으면 renderCard 뒤에 이 화면을 채운다.

var EQM_CSS = '\
.eqm{--yel:#fde68a;--grn:#86efac;--vio:#c4b5fd;--mute:#94a3b8;--card:#1e293b;font-size:.85rem;color:#e2e8f0;line-height:1.7}\
.eqm .s{display:flex;gap:8px;align-items:flex-start;font-size:.9rem;font-weight:700;color:var(--vio);background:rgba(0,0,0,.25);border-radius:10px;padding:9px 12px}\
.eqm .s .n{flex:none;width:22px;height:22px;border-radius:50%;background:var(--yel);color:#1e293b;font-size:.75rem;display:flex;align-items:center;justify-content:center;margin-top:1px}\
.eqm .s.first{color:var(--yel)}\
.eqm .s.clash{background:rgba(253,230,138,.08);border:1px solid rgba(253,230,138,.3);color:var(--yel);font-style:italic}\
.eqm .s.bub{color:#e2e8f0;font-weight:400}\
.eqm .br{color:var(--mute);font-size:.78rem;padding:6px 8px 6px 14px;border-left:2px dashed #475569;margin:4px 0 4px 10px}\
.eqm .eqs{display:flex;gap:10px;justify-content:center;margin:8px 0 2px;font-family:Jua,sans-serif;font-size:1.15rem}\
.eqm .eqs div{background:#0b1220;border:1px solid #334155;border-radius:10px;padding:6px 14px}\
.eqm .dial{display:flex;align-items:center;justify-content:center;gap:8px;margin:8px 0 2px}\
.eqm .xl{font-family:Jua,sans-serif;font-size:1.5rem;color:var(--yel)}\
.eqm .xb{display:inline-block;text-align:center;background:#0b1220;border:2px solid var(--yel);border-radius:14px;padding:4px 10px;font-family:Jua,sans-serif;font-size:1.7rem;color:var(--yel)}\
.eqm input.xv{width:1.5ch;background:transparent;border:0;color:var(--yel);font:inherit;text-align:center;outline:none;-moz-appearance:textfield}\
.eqm input.xv::-webkit-outer-spin-button,.eqm input.xv::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}\
.eqm .mis{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;font-size:.8rem;margin:2px 0 8px}\
.eqm .mis span{border:1px dashed #64748b;border-radius:999px;padding:2px 10px;color:var(--mute)}\
.eqm .mis span.done{border:1px solid var(--grn);color:var(--grn);background:rgba(134,239,172,.1)}\
.eqm .mach{display:grid;gap:8px;margin-top:8px}\
.eqm .m{display:flex;align-items:center;gap:10px;background:var(--card);border:2px solid #334155;border-radius:14px;padding:10px 12px;transition:border-color .2s,background .2s}\
.eqm .m .eq{flex:1;min-width:0}\
.eqm .m .t{font-family:Jua,sans-serif;font-size:1.1rem;color:#e2e8f0}\
.eqm .m .c{font-size:.8rem;color:var(--mute);min-height:1.3em}\
.eqm .lamp{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.6rem;background:#0b1220;border:2px solid #475569;flex:none}\
.eqm .m.ok{border-color:#22c55e;background:rgba(34,197,94,.10)}.eqm .m.ok .lamp{background:#14532d;border-color:#22c55e}\
.eqm .m.no{border-color:#f87171;background:rgba(248,113,113,.10)}.eqm .m.no .lamp{background:#7f1d1d;border-color:#f87171}\
.eqm .pop{animation:eqmpop .35s ease}@keyframes eqmpop{0%{transform:scale(.7)}60%{transform:scale(1.2)}100%{transform:scale(1)}}\
.eqm .shake{animation:eqmshake .3s ease}@keyframes eqmshake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}\
@media (prefers-reduced-motion:reduce){.eqm .pop,.eqm .shake{animation:none}}\
.eqm .tried{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:8px 0 0;min-height:30px;font-size:.78rem}\
.eqm .tried i{font-style:normal;border-radius:8px;padding:1px 8px;border:1px solid}\
.eqm .tried i.t{color:#86efac;border-color:#22c55e}.eqm .tried i.f{color:#fca5a5;border-color:#f87171}\
.eqm .rnd{display:block;margin:8px auto 0;border-radius:999px;border:1px solid var(--yel);background:rgba(253,230,138,.12);color:var(--yel);padding:8px 18px;font-family:Jua,sans-serif;font-size:.9rem;cursor:pointer}\
.eqm .rnd:active{transform:scale(.95)}\
.eqm .cnt{text-align:center;font-size:.8rem;color:var(--grn);margin-top:6px;min-height:1.4em}\
.eqm .ch{display:flex;gap:8px;margin-top:8px}\
.eqm .ch button{flex:1;border-radius:10px;border:1px solid #475569;background:var(--card);color:#e2e8f0;padding:10px;font-family:Jua,sans-serif;font-size:.9rem;cursor:pointer}\
.eqm .ch button.on{border-color:var(--yel);background:rgba(253,230,138,.12)}\
.eqm .fb{margin-top:8px;font-size:.82rem;min-height:1.5em}\
.eqm textarea{width:100%;margin-top:8px;background:#0b1220;color:#e2e8f0;border:1px solid #475569;border-radius:10px;padding:8px 10px;font-family:inherit;font-size:.85rem;min-height:60px}';

function eqmParen(n){ return n < 0 ? '(' + n + ')' : String(n); }

function eqmDevice(root, cfg){
  root.innerHTML = '<div class="dial"><span class="xl">x =</span><div class="xb"><input class="xv" type="number" step="1" value="1" inputmode="numeric" aria-label="x에 넣을 수"></div></div>'
    + '<div class="mach"><div class="m"><div class="eq"><div class="t">' + cfg.title + '</div><div class="c"></div></div><div class="lamp">·</div></div></div>'
    + '<div class="tried"></div>'
    + '<button class="rnd" type="button">🎲 아무 수나 넣어 보기</button><div class="cnt" aria-live="polite"></div>';
  var d = {tries:0, falses:0, tried:{}};
  var $ = function(q){ return root.querySelector(q); };
  var xin = $('.xv');
  function fit(){ xin.style.width = (Math.max(1, xin.value.length) + 0.5) + 'ch'; }
  d.set = function(n, init){
    if(!init) d.tries++;
    if(+xin.value !== n || xin.value === '') xin.value = n;
    fit();
    var ok = cfg.test(n);
    if(!init){ d.tried[n] = ok; if(!ok) d.falses++; }
    $('.m').className = 'm ' + (ok ? 'ok pop' : 'no shake');
    $('.lamp').textContent = ok ? '✅' : '❌';
    $('.c').textContent = cfg.calc(n);
    var h = '';
    Object.keys(d.tried).map(Number).sort(function(a, b){ return a - b; }).forEach(function(k){
      h += '<i class="' + (d.tried[k] ? 't' : 'f') + '">x=' + k + ' ' + (d.tried[k] ? '참' : '거짓') + '</i>';
    });
    $('.tried').innerHTML = h;
    if(cfg.after) cfg.after(d, n, root);
  };
  xin.addEventListener('focus', function(){ setTimeout(function(){ xin.select(); }, 0); });
  xin.addEventListener('click', function(){ xin.select(); });
  xin.addEventListener('input', function(){
    fit();
    var v = xin.value;
    if(v === '' || !/^-?[0-9]+$/.test(v)) return;
    d.set(parseInt(v, 10));
  });
  $('.rnd').onclick = function(){ d.set(Math.floor(Math.random() * 12) - 3); };
  d.root = root;
  return d;
}

function eqmOnCard(){
  var card = (typeof CS !== 'undefined' && CS.cards) ? CS.cards[CS.cur] : null;
  if(!card || card.fun !== 'eqmean') return;
  var host = document.getElementById('eqm-root');
  if(!host) return;
  if(!document.getElementById('eqm-css')){
    var st = document.createElement('style'); st.id = 'eqm-css'; st.textContent = EQM_CSS;
    document.head.appendChild(st);
  }
  var S = function(n, html, cls){ return '<div class="s' + (cls ? ' ' + cls : '') + '"><span class="n">' + n + '</span><span>' + html + '</span></div>'; };
  var BR = function(t){ return '<div class="br">↓ ' + t + '</div>'; };
  host.innerHTML = '<div class="eqm">'
    + S(1, '"2+3=5 와 x+3=5 는 뭐가 다를까?"', 'first')
    + '<div class="eqs"><div>2 + 3 = 5</div><div>x + 3 = 5</div></div>'
    + BR('두 식을 나란히 놓고 보면, 눈에 띄는 게 하나 있어요.')
    + S(2, '💬 "x가 있다"', 'bub')
    + BR('그 한마디가 열쇠예요. 한 걸음 더 가 볼까요?')
    + S(3, '"x가 있으면 뭐가 달라져? 아래 식도 항상 참이야?"')
    + BR('아래 식 x + 3 = 5 의 x에 직접 수를 넣어서 확인해 봐요.')
    + S(4, '"x에 0을 넣으면? 2를 넣으면? 어떤 건 참이고 어떤 건 거짓이야?"')
    + '<div class="mach"><div class="m ok"><div class="eq"><div class="t">2 + 3 = 5</div><div class="c">5 = 5</div></div><div class="lamp">✅</div></div></div>'
    + '<div class="mis"><span id="eqm-m0">x에 0 넣어 보기</span><span id="eqm-m2">x에 2 넣어 보기</span></div>'
    + '<div id="eqm-devB"></div>'
    + BR('x에 따라 참이 되기도, 거짓이 되기도 해요. 그런데 이런 식은 어떨까요?')
    + S(5, '⚡ 충돌 장치<br>"x+3 = x+3 은 어때?<br>어떤 x를 넣어도 참이야.<br>이건 x+3=5 랑 같은 종류일까, 다른 종류일까?"', 'clash')
    + '<div id="eqm-devC"></div>'
    + '<div class="ch"><button id="eqm-same" type="button">같은 종류</button><button id="eqm-diff" type="button">다른 종류</button></div>'
    + '<div class="fb" id="eqm-fb"></div>'
    + BR('위에서 두 식의 불이 어떻게 달랐는지 떠올려 봐요.')
    + S(6, '방정식과 항등식의 차이를 내 말로 써 보세요.')
    + '<textarea id="eqm-mine" placeholder="내 말로 써 보세요"></textarea>'
    + '</div>';
  var devB = eqmDevice(document.getElementById('eqm-devB'), {
    title: 'x + 3 = 5',
    test: function(n){ return n + 3 === 5; },
    calc: function(n){ return eqmParen(n) + ' + 3 = 5 → ' + (n + 3) + ' = 5'; },
    after: function(d, n, root){
      if(n === 0) document.getElementById('eqm-m0').className = 'done';
      if(n === 2) document.getElementById('eqm-m2').className = 'done';
      root.querySelector('.cnt').textContent = '넣어 본 횟수 ' + d.tries + '번 · 참이 나온 횟수 ' + (d.tries - d.falses) + '번 · 거짓이 나온 횟수 ' + d.falses + '번';
    }
  });
  var devC = eqmDevice(document.getElementById('eqm-devC'), {
    title: 'x + 3 = x + 3',
    test: function(){ return true; },
    calc: function(n){ return eqmParen(n) + ' + 3 = ' + eqmParen(n) + ' + 3 → ' + (n + 3) + ' = ' + (n + 3); },
    after: function(d, n, root){
      root.querySelector('.cnt').textContent = '넣어 본 횟수 ' + d.tries + '번 · 거짓이 나온 횟수 ' + d.falses + '번'
        + (d.tries >= 5 && d.falses === 0 ? ' — 아무리 넣어도 거짓이 안 나와요!' : '');
    }
  });
  devB.set(1, true); devC.set(1, true);
  var pick = function(w){
    document.getElementById('eqm-same').className = w === 'same' ? 'on' : '';
    document.getElementById('eqm-diff').className = w === 'diff' ? 'on' : '';
    document.getElementById('eqm-fb').innerHTML = w === 'diff'
      ? '<b style="color:#86efac">맞아요!</b> 위에서 x를 바꿔 보세요. x + 3 = 5는 켜졌다 꺼지고, x + 3 = x + 3은 언제나 켜져 있어요.'
      : '정말 같을까요? 위에서 x를 여러 수로 바꿔 보면서 두 식의 불이 어떻게 달라지는지 봐요.';
  };
  document.getElementById('eqm-same').onclick = function(){ pick('same'); };
  document.getElementById('eqm-diff').onclick = function(){ pick('diff'); };
}

window.addEventListener('load', function(){
  if(typeof renderCard !== 'function') return;
  var r0 = renderCard;
  renderCard = function(){ r0(); eqmOnCard(); };
});
