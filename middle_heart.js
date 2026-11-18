// 첫 상자 하트·따라 쓰기·정원 장면(일차방정식 허브) — data-hb-key가 있는 .hb 상자를 다룬다.
// ① .hb-row(눌러 펼치는 줄)를 모두 열면 상자 오른쪽 위에 ❤️가 생긴다.
// ② 펼친 뒤 열리는 "따라 써 볼까요?"에서 두 줄을 그대로 또는 내 말로 쓰면(핵심 뜻 규칙, AI 없이) 큰 하트와 정원 장면이 나온다.
// 저장은 이 브라우저 localStorage의 하트 키(data-hb-key, data-hb-big-key)뿐이다. 정원 장면은 보여주기이며 포인트·정원 기록(toro_*, toroPoints)은 건드리지 않는다.
// 다른 단원 첫 상자에도 같은 마크업에 키만 바꿔 쓴다.
(function(){
var css = "/* ── 하트 상자(공통) ── */\n.hb{position:relative;background:linear-gradient(155deg,rgba(168,85,247,.14),rgba(168,85,247,.05));border:2px solid rgba(168,85,247,.4);border-radius:16px;padding:16px;margin-bottom:16px;transition:border-color .4s,box-shadow .4s}\n.hb.done{border-color:rgba(248,113,113,.6);box-shadow:0 0 0 3px rgba(248,113,113,.12)}\n.hb-head{display:flex;align-items:center;gap:8px;margin:18px 0 12px}\n.hb-title{flex:1;font-family:'Jua',sans-serif;color:#e9d5ff;font-size:.86rem;line-height:1.5;text-align:left;margin:0;padding:0}\n.hb-scale{flex:none;width:52%;max-width:210px;height:auto;display:block;overflow:visible}\n.hb-heart{position:absolute;top:8px;right:10px;font-size:1.5rem;line-height:1;opacity:0;transform:scale(.3);transition:opacity .3s,transform .5s cubic-bezier(.2,1.6,.4,1);pointer-events:none}\n.hb.done .hb-heart{opacity:1;transform:scale(1)}\n.hb-lead{font-size:.82rem;line-height:1.7;text-align:center;margin-bottom:12px}\n.hb-lead b{color:#fde68a}\n.hb-rows{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}\n.hb-row{display:block;width:100%;text-align:left;background:rgba(0,0,0,.18);border:1px solid transparent;border-radius:10px;padding:10px 12px;color:inherit;font:inherit;cursor:pointer}\n.hb-row:hover{border-color:rgba(167,139,250,.5)}\n.hb-row .h{font-family:'Jua',sans-serif;color:#a78bfa}\n.hb-row .heart{float:right;font-size:1.05rem;filter:grayscale(1) opacity(.45)}\n.hb-row.open .heart{filter:none}\n.hb-row .tap{color:#64748b;font-size:.74rem;margin-left:6px}\n.hb-row.open .tap{display:none}\n.hb-row .more{display:none;color:#c4b5fd;font-size:.8rem;margin-top:4px}\n.hb-row.open .more{display:block}\n.hb-row.open{border-color:rgba(248,113,113,.35)}\n.hb-ex{background:rgba(255,255,255,.04);border-radius:10px;padding:10px 12px;font-size:.78rem;color:#c8d8e8;line-height:1.7}\n.hb-ex b.x{color:#fde68a}\n.hb-msg{text-align:center;font-family:Jua,sans-serif;font-size:.82rem;color:#fca5a5;margin-top:10px;min-height:1.2em}\n/* 반짝임: 하트는 빛이 숨 쉬듯 커졌다 작아지고, 둘레에서 ✨가 번갈아 반짝인다 */\n.hb-heart .hh{display:inline-block}\n.hb.done .hb-heart .hh{animation:hbPulse 1.6s ease-in-out .5s infinite}\n@keyframes hbPulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 3px rgba(248,113,113,.6))}50%{transform:scale(1.18);filter:drop-shadow(0 0 11px rgba(253,230,138,.95)) brightness(1.25)}}\n.hb-heart .sp{position:absolute;font-size:.7rem;opacity:0;pointer-events:none}\n.hb.done .hb-heart .sp{animation:hbTwinkle 1.6s ease-in-out infinite}\n.hb-heart .s1{top:-10px;left:-8px}.hb-heart .s2{top:-6px;right:-12px;font-size:.55rem}.hb-heart .s3{bottom:-8px;right:-6px;font-size:.8rem}.hb-heart .s4{bottom:-4px;left:-12px;font-size:.5rem}\n.hb.done .hb-heart .s1{animation-delay:.5s}.hb.done .hb-heart .s2{animation-delay:.9s}.hb.done .hb-heart .s3{animation-delay:1.3s}.hb.done .hb-heart .s4{animation-delay:.7s}\n@keyframes hbTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1.15) rotate(35deg)}}\n.hb-row.open .heart{animation:hbRow 1.8s ease-in-out infinite}\n@keyframes hbRow{0%,100%{filter:drop-shadow(0 0 0 rgba(253,230,138,0))}50%{filter:drop-shadow(0 0 6px rgba(253,230,138,.9)) brightness(1.2)}}\n/* 따라 쓰기 + 큰 하트 */\n.hb-copy{margin-top:12px;background:rgba(0,0,0,.18);border:1px dashed rgba(167,139,250,.45);border-radius:12px;padding:12px}\n.hb-copy .ct{font-family:'Jua',sans-serif;color:#c4b5fd;font-size:.88rem;margin-bottom:4px}\n.hb-copy .cd{font-size:.76rem;color:#94a3b8;margin-bottom:8px;line-height:1.6}\n.hb-copy .lock{font-size:.78rem;color:#94a3b8;text-align:center;padding:6px 0}\n.hb-copy .body{display:none}\n.hb.done .hb-copy .body{display:block}.hb.done .hb-copy .lock{display:none}\n.hb-line{margin-bottom:8px}\n.hb-line .lb{font-family:'Jua',sans-serif;color:#a78bfa;font-size:.76rem;margin-bottom:2px}\n.hb-line input{width:100%;background:#0f172a;border:2px solid #475569;color:#e2e8f0;border-radius:8px;padding:9px 10px;font:inherit;font-size:.9rem}\n.hb-line input:focus{outline:none;border-color:#fde68a}\n.hb-line.ok input{border-color:#10b981;background:rgba(16,185,129,.08)}\n.hb-line.no input{border-color:#f87171}\n.hb-line .fb{font-size:.76rem;margin-top:3px;min-height:1.1em}\n.hb-line.ok .fb{color:#6ee7b7}.hb-line.no .fb{color:#fca5a5}\n.hb-go{display:block;width:100%;margin-top:6px;padding:10px;border:0;border-radius:10px;font-family:Jua,sans-serif;font-size:.9rem;color:#fff;background:linear-gradient(135deg,#7c3aed,#c026d3);cursor:pointer}\n.hb-big{display:none;text-align:center;margin-top:14px}\n.hb-big.on{display:block}\n.hb-big .bh{position:relative;display:inline-block;font-size:4.4rem;line-height:1;animation:hbBigPop .7s cubic-bezier(.2,1.6,.4,1) both,hbPulse 1.6s ease-in-out .8s infinite}\n@keyframes hbBigPop{0%{transform:scale(.2);opacity:0}100%{transform:scale(1);opacity:1}}\n.hb-big .bh .sp{position:absolute;opacity:0;pointer-events:none;animation:hbTwinkle 1.6s ease-in-out infinite}\n.hb-big .bh .s1{top:-8px;left:-18px;font-size:1.3rem;animation-delay:.9s}.hb-big .bh .s2{top:-4px;right:-22px;font-size:1rem;animation-delay:1.3s}.hb-big .bh .s3{bottom:-6px;right:-14px;font-size:1.4rem;animation-delay:1.7s}.hb-big .bh .s4{bottom:0;left:-24px;font-size:.9rem;animation-delay:1.1s}\n.hb-big .bt{font-family:Jua,sans-serif;color:#fde68a;font-size:.95rem;margin-top:8px}\n/* 정원 장면(보여주기): 실제 정원 앱의 포인트 칸·정원 카드 모양을 따라 한 장면. 저장하거나 정원 키를 쓰지 않는다. */\n.hb-garden{margin-top:14px;text-align:center;background:rgba(0,0,0,.2);border:1px solid rgba(74,222,128,.25);border-radius:14px;padding:12px}\n.hb-garden .gs-cap{font-family:'Jua',sans-serif;color:#86efac;font-size:.82rem;margin-bottom:2px}\n.hb-garden .gs-sub{font-size:.68rem;color:#94a3b8;margin-bottom:8px}\n.gs-stat{position:relative;display:inline-block;min-width:130px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:14px;padding:12px 10px}\n.gs-stat .num{font-family:'Jua',sans-serif;font-size:1.5rem;color:#4ade80}\n.gs-stat .lbl{font-size:.72rem;color:rgba(255,255,255,.55);margin-top:2px}\n.gs-plus{position:absolute;left:50%;top:-4px;transform:translateX(-50%);font-family:'Jua',sans-serif;color:#fde68a;font-size:1.1rem;opacity:0;pointer-events:none;text-shadow:0 0 8px rgba(253,230,138,.8)}\n.gs-plus.go{animation:gsRise 1.1s ease-out forwards}\n@keyframes gsRise{0%{opacity:0;transform:translate(-50%,10px) scale(.6)}25%{opacity:1;transform:translate(-50%,-6px) scale(1.15)}100%{opacity:0;transform:translate(-50%,-34px) scale(1)}}\n.gs-garden{margin-top:10px;background:rgba(255,255,255,.03);border-radius:14px;padding:12px 8px}\n.gs-title{font-size:.95rem;color:rgba(255,255,255,.75);margin-bottom:6px}\n.gs-plants{font-size:1.8rem;line-height:1.7;letter-spacing:2px;min-height:2.2em}\n.gs-plants .gs-empty{font-size:.78rem;color:rgba(255,255,255,.45);letter-spacing:0}\n.gs-plants .gs-sprout{display:inline-block;animation:gsSprout .8s cubic-bezier(.2,1.6,.4,1) both}\n@keyframes gsSprout{0%{transform:scale(0) translateY(14px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}\n.gs-replay{margin-top:8px;background:#1e293b;border:1px solid #334155;color:#94a3b8;border-radius:10px;padding:6px 12px;font-family:Jua,sans-serif;font-size:.74rem;cursor:pointer}\n@media (prefers-reduced-motion:reduce){.gs-plus.go,.gs-plants .gs-sprout{animation:none}}\n@media (prefers-reduced-motion:reduce){.hb-big .bh,.hb-big .bh .sp{animation:none}.hb-big .bh .sp{opacity:.8}}\n@media (prefers-reduced-motion:reduce){.hb-heart,.hb{transition:none}.hb.done .hb-heart .hh,.hb.done .hb-heart .sp,.hb-row.open .heart{animation:none}.hb.done .hb-heart .sp{opacity:.8}}";
var st = document.createElement("style"); st.id = "hb-style"; st.textContent = css; document.head.appendChild(st);
// 하트 상자 공통 함수: data-hb-key가 있는 .hb 상자 안의 .hb-row를 모두 눌러 펼치면 상자에 ❤️가 생긴다.
function hbGet(k){ try{ return localStorage.getItem(k) === '1'; }catch(e){ return false; } }
function hbSet(k){ try{ localStorage.setItem(k, '1'); }catch(e){} }
function hbInit(box){
  var key = box.getAttribute('data-hb-key'), rows = box.querySelectorAll('.hb-row'), msg = box.querySelector('.hb-msg');
  function open(r){ r.classList.add('open'); r.setAttribute('aria-expanded', 'true'); }
  function check(fresh){
    var all = Array.prototype.every.call(rows, function(r){ return r.classList.contains('open'); });
    if(!all) return;
    box.classList.add('done');
    if(fresh){ hbSet(key); if(msg) msg.textContent = '❤️ 하트 완성! 두 가지를 모두 찾았어요.'; }
  }
  if(hbGet(key)){ Array.prototype.forEach.call(rows, open); box.classList.add('done'); if(msg) msg.textContent = '❤️ 이미 읽었어요.'; }
  Array.prototype.forEach.call(rows, function(r){
    r.addEventListener('click', function(){
      if(r.classList.contains('open')) return;
      open(r);
      var left = Array.prototype.filter.call(rows, function(x){ return !x.classList.contains('open'); }).length;
      if(msg && left) msg.textContent = '하나 더 눌러 보세요! (' + (rows.length - left) + ' / ' + rows.length + ')';
      check(true);
    });
  });
}
// 따라 쓰기: 번호·띄어쓰기·따옴표·화살표는 보지 않고, 글자와 '='는 그대로 비교한다.
function hbCopyNorm(s){ return String(s || '').replace(/^\s*[①②1-9][.)]?/, '').replace(/→|->|=>|⇒/g, '').replace(/[\s"'“”‘’]/g, '').toLowerCase(); }
// 정원 장면(보여주기): 포인트 0 → 10, 새싹 1개. 실제 정원 앱의 단계 규칙(10P 미만은 새싹 정원, 새싹 ceil(P/10)개)과 같은 모양이다.
function hbScene(root, animate){
  var num = root.querySelector('.gs-stat .num'), plus = root.querySelector('.gs-plus'), title = root.querySelector('.gs-title'), plants = root.querySelector('.gs-plants');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(root._t){ root._t.forEach(clearTimeout); }
  root._t = [];
  function finalState(){ num.textContent = '10'; title.textContent = '새싹 정원 (10P)'; plants.innerHTML = '<span class="gs-sprout">🌱</span>'; }
  function startState(){ num.textContent = '0'; title.textContent = '텅 빈 정원'; plants.innerHTML = '<span class="gs-empty">아직 정원이 비어있어요.</span>'; plus.classList.remove('go'); }
  if(!animate || reduce){ finalState(); return; }
  startState();
  root._t.push(setTimeout(function(){ void plus.offsetWidth; plus.classList.add('go'); var n = 0, tick = setInterval(function(){ n++; num.textContent = String(n); if(n >= 10){ clearInterval(tick); } }, 90); root._t.push(tick); }, 600));
  root._t.push(setTimeout(finalState, 600 + 10 * 90 + 150));
}
// 핵심 뜻 규칙: 원문 그대로가 아니어도, 꼭 들어가야 할 말이 있으면 인정한다(AI 없이 규칙으로만 판정).
// need: [찾는 말, 빠졌을 때 알려 줄 이름]. when: 앞 글이 있으면 뒤 글도 있어야 한다(예: '놓'이 있으면 'x'도).
var HB_RULES = {
  '1': {min: 6, need: [[/모르|미지수/, "'모르는 것'"], [/찾/, "'찾는다'"]], when: [[/놓/, /x/, "'x로 놓는다'의 x"]]},
  '2': {min: 7, need: [[/같은(값|두)/, "'같은 값'"], [/두/, "'두 가지(두 개)'"], [/찾/, "'찾는다'"]], when: [[/연결/, /=/, "'='"]]}
};
function hbRuleCheck(rule, got){
  var r = HB_RULES[rule]; if(!r) return {ok: false, hint: ''};
  var miss = r.need.filter(function(n){ return !n[0].test(got); }).map(function(n){ return n[1]; });
  r.when.forEach(function(w){ if(w[0].test(got) && !w[1].test(got)) miss.push(w[2]); });
  if(miss.length) return {ok: false, hint: '빠진 것: ' + miss.join(', ') + '. 위 줄을 다시 보고 써 보세요.'};
  if(got.length < r.min) return {ok: false, hint: '조금만 더 자세히 써 보세요.'};
  return {ok: true};
}
function hbCopyInit(box){
  var wrap = box.querySelector('.hb-copy'); if(!wrap) return;
  var bkey = wrap.getAttribute('data-hb-big-key'), lines = wrap.querySelectorAll('.hb-line'), big = wrap.querySelector('.hb-big'), msg = box.querySelector('.hb-msg');
  function showBig(fresh){ big.classList.add('on'); var gs = big.querySelector('.hb-garden'); if(gs){ hbScene(gs, !!fresh); var rp = gs.querySelector('.gs-replay'); if(rp && !rp._on){ rp._on = true; rp.addEventListener('click', function(){ hbScene(gs, true); }); } } Array.prototype.forEach.call(lines, function(l){ l.classList.add('ok'); l.querySelector('input').disabled = true; l.querySelector('.fb').textContent = '✔ 정확해요'; }); var go = wrap.querySelector('.hb-go'); if(go) go.style.display = 'none'; }
  Array.prototype.forEach.call(lines, function(l){ l.querySelector('input').addEventListener('paste', function(e){ e.preventDefault(); l.querySelector('.fb').textContent = '붙여 넣기는 안 돼요. 직접 써 보세요!'; l.classList.remove('ok'); l.classList.add('no'); }); });
  if(hbGet(bkey)){ Array.prototype.forEach.call(lines, function(l){ l.querySelector('input').value = l.getAttribute('data-ans'); }); showBig(false); return; }
  wrap.querySelector('.hb-go').addEventListener('click', function(){
    var allOk = true;
    Array.prototype.forEach.call(lines, function(l){
      var inp = l.querySelector('input'), fb = l.querySelector('.fb'), got = hbCopyNorm(inp.value);
      var wants = [l.getAttribute('data-ans')].concat(l.getAttribute('data-alt') ? l.getAttribute('data-alt').split('|') : []).map(hbCopyNorm);
      l.classList.remove('ok', 'no');
      if(!got){ fb.textContent = '아직 안 썼어요.'; l.classList.add('no'); allOk = false; return; }
      if(wants.indexOf(got) >= 0){ fb.textContent = '✔ 정확해요'; l.classList.add('ok'); return; }
      var rc = hbRuleCheck(l.getAttribute('data-rule'), got);
      if(rc.ok){ fb.textContent = '✔ 좋아요! 내 말로 잘 썼어요'; l.classList.add('ok'); return; }
      fb.textContent = rc.hint || '위 줄을 다시 보고 써 보세요.';
      l.classList.add('no'); allOk = false;
    });
    if(allOk){ hbSet(bkey); showBig(true); if(msg) msg.textContent = '❤️ 하트 완성! 두 가지를 모두 찾았어요.'; }
  });
}
function hbRun(){
  if(window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches){ Array.prototype.forEach.call(document.querySelectorAll('.hb-scale animateTransform'), function(a){ a.parentNode.removeChild(a); }); }
  Array.prototype.forEach.call(document.querySelectorAll(".hb[data-hb-key]"), function(b){ hbInit(b); hbCopyInit(b); });
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", hbRun); else hbRun();
})();
