// 일차방정식 기본 문제 10 — 단계 풀이 (풀이 A/B 균형 무작위)
// 풀이 A: ① 미지수는? → ② 같은 값 두 개는?(문장) → ③ 식으로 쓰기
// 풀이 B: ① 같은 두 양은?(문장) → ② 없는 것은?(= 미지수) → ③ 식으로 쓰기
// 계산(풀기)과 확인은 질문하지 않고 마지막 결과 화면에 보여 준다. 기존 'eq-basic' 카드는 건드리지 않고 새 묶음 'eq-basic-walk'를 추가한다.
// 한 판(10문제)에서 A와 B를 5문제씩 섞어서 배정한다. 주소에 ?eqw=1 을 붙이면 어느 풀이인지 표시하고, ?eqw=A 또는 ?eqw=B 로 풀이를 고정해 볼 수 있다(검토용).
var EQW_SET = 'eq-basic-walk';
var EQW = {styles: [], w: null};

function eqwFr(n, d){ return '<span class="frac"><span class="num">' + n + '</span><span class="den">' + d + '</span></span>'; }
var EQW_UNK_ASK = '이 문제가 구하라고 하는 것, 곧 <b>모르는 것(미지수)</b>은 무엇일까요? 짧게 써 보세요.';

var EQW_CARDS = [
 {cat:'합과 차', problem:'사탕 30개를 형과 동생이 나누었습니다. 형이 동생보다 6개 더 많다면 형의 사탕 수는?',
  unk:{ask:EQW_UNK_ASK,
    fields:[{accept:[/^(?!.*동생).*형/]}],
    wrong:[{re:/동생/, msg:'동생의 사탕 수가 아니에요. 문제 끝 "형의 사탕 수는?"이 묻는 것을 보세요.'},{re:/30|전체/, msg:'전체 30개는 이미 알려 줬어요. 질문 문장을 다시 읽어 보세요.'}],
    opts:[{t:'형의 사탕 수', r:'맞아요! 문제 끝에서 "형의 사탕 수는?"을 물었어요.'},{t:'동생의 사탕 수', r:'동생의 사탕 수는 구하라고 하지 않았어요. 질문은 형의 사탕 수예요.'},{t:'전체 사탕 수', r:'전체 30개는 문제에 이미 나와 있어요.'}],
    right:'미지수: 형의 사탕 수 → <b>x개</b>라고 놓아요.'},
  same:{opts:[{t:'(형의 사탕 수) + (동생의 사탕 수) = 전체 30개', r:'맞아요! 형과 동생의 사탕을 합하면 나눈 전체 30개와 같아요.'},{t:'(형의 사탕 수) = (동생의 사탕 수)', r:'형이 6개 더 많다고 했으니 두 수는 같지 않아요.'},{t:'(형의 사탕 수) − (동생의 사탕 수) = 30개', r:'30개는 둘을 합한 전체예요. 둘의 차는 6개예요.'}],
    right:'같은 두 양: <b>(형의 사탕 수) + (동생의 사탕 수)</b> 와 <b>전체 30개</b>'},
  eq:[
   {lab:'각 값을 x로 나타내기', ask:'형의 사탕 수를 x개라고 하면 <b>동생의 사탕 수</b>는 몇 개일까요? x로 나타내 보세요. (형이 6개 더 많음)',
    fields:[{pre:'동생 =', post:'개', accept:['x-6']}],
    wrong:[{re:/^x\+6$/, msg:'형이 6개 "더 많으니" 동생은 6개 적어요. 더하면 동생이 형보다 많아져요.'},{re:/^6x$|^x6$/, msg:'6x는 6에 x를 곱한 거예요. 6개 "차이"는 더하거나 빼요.'}],
    opts:[{t:'x − 6 (개)', r:'맞아요! 형이 6개 더 많으니 동생은 형보다 6개 적어요.'},{t:'x + 6 (개)', r:'더하면 동생이 더 많아져요. 형이 더 많아요.'},{t:'6x (개)', r:'6x는 6배라는 뜻이에요. 6개 차이는 곱하지 않고 빼요.'}],
    right:'형 = x, 동생 = x − 6'},
   {lab:'"="로 잇기', ask:'같은 두 양 <b>(형 + 동생) = 전체 30개</b>를 식으로 세워 보세요. (형 x, 동생 x − 6)',
    fields:[{wide:true, accept:['x+(x-6)=30','x+x-6=30','30=x+(x-6)','(x-6)+x=30','2x-6=30'], placeholder:'식을 써 보세요'}],
    wrong:[{re:/x\+\(?x\+6\)?=30/, msg:'동생은 x + 6이 아니라 x − 6이에요.'},{re:/^x=30$|^x-6=30$/, msg:'형 혼자나 동생 혼자가 30개는 아니에요. 둘을 더한 것이 30개예요.'}],
    opts:[{t:'x + (x − 6) = 30', r:'맞아요! (형 + 동생) = 전체 30개.'},{t:'x + (x + 6) = 30', r:'동생은 형보다 6개 적어서 x − 6이에요.'},{t:'x − (x − 6) = 30', r:'빼면 두 수의 차(6)가 돼요. 전체 30개는 더해서 나와요.'}],
    right:'방정식: x + (x − 6) = 30'}
  ],
  finalText:'<b class="k">답: 형 18개</b><div class="recap">④ 풀기(계산): x + (x − 6) = 30 → 2x − 6 = 30 → 2x = 36 → x = 18<br>⑤ 확인: 형 18개, 동생 12개, 18 + 12 = 30, 18 − 12 = 6 ✓</div>'},

 {cat:'연속하는 수', problem:'연속하는 세 홀수의 합이 33입니다. 중간 수를 x로 두는 것과 가장 작은 수를 x로 두는 것 중 무엇이 더 편할까요? 세 수를 구하세요.',
  unk:{ask:'세 홀수 중 하나를 <b>미지수 x</b>로 놓아야 해요. 어느 것을 x로 놓으면 식이 가장 간단해질까요?', choiceFirst:true,
    opts:[{t:'가운데 홀수(중간 수)를 x로', r:'맞아요! 앞의 수는 x − 2, 뒤의 수는 x + 2라서 더할 때 −2와 +2가 서로 없어지고 3x만 남아요.'},{t:'가장 작은 홀수를 x로', r:'풀 수는 있어요. 하지만 x, x + 2, x + 4가 되어 더하면 3x + 6으로 더 복잡해져요.'},{t:'가장 큰 홀수를 x로', r:'풀 수는 있어요. 하지만 x − 4, x − 2, x가 되어 더하면 3x − 6으로 더 복잡해져요.'}],
    right:'미지수: 가운데 홀수 → <b>x</b>라고 놓아요. (앞뒤 수가 x − 2, x + 2)'},
  unkB:{ask:'방금 찾은 문장에서 값을 모르는 것은 세 홀수예요. 이 중 <b>어느 것을 x로 놓으면</b> 식이 가장 간단해질까요?'},
  same:{opts:[{t:'(가장 작은 홀수) + (가운데 홀수) + (가장 큰 홀수) = 33', r:'맞아요! 세 홀수를 더한 값이 33과 같아요.'},{t:'(가장 작은 홀수) = (가운데 홀수) = (가장 큰 홀수)', r:'연속하는 홀수는 2씩 차이 나서 서로 같지 않아요.'},{t:'(가장 작은 홀수) × (가운데 홀수) × (가장 큰 홀수) = 33', r:'문제는 세 수의 "합"이 33이라고 했어요. 곱이 아니에요.'}],
    right:'같은 두 양: <b>(세 홀수를 더한 값)</b> 과 <b>33</b>'},
  eq:[
   {lab:'각 값을 x로 나타내기', ask:'가운데 홀수를 x라고 하면 <b>가장 작은 홀수</b>는 얼마일까요? x로 나타내 보세요. (연속하는 홀수)',
    fields:[{pre:'가장 작은 홀수 =', accept:['x-2']}],
    wrong:[{re:/^x-1$/, msg:'x − 1은 연속하는 "정수"일 때예요. 연속하는 홀수는 2씩 차이 나요.'},{re:/^x\+2$/, msg:'x + 2는 가운데보다 큰 수예요. 가장 작은 수는 가운데보다 작아요.'}],
    opts:[{t:'x − 2', r:'맞아요! 연속하는 홀수는 2씩 차이 나서 가운데보다 2 작아요.'},{t:'x − 1', r:'x − 1은 연속하는 정수일 때예요. 홀수는 2씩 건너뛰어요.'},{t:'x + 2', r:'x + 2는 가운데보다 큰 수예요.'}],
    right:'가장 작은 홀수 = x − 2, 가운데 홀수 = x, 가장 큰 홀수 = x + 2'},
   {lab:'"="로 잇기', ask:'같은 두 양 <b>(세 홀수를 더한 값) = 33</b>을 식으로 세워 보세요. (x − 2, x, x + 2)',
    fields:[{wide:true, accept:['(x-2)+x+(x+2)=33','x-2+x+x+2=33','33=(x-2)+x+(x+2)','x+(x-2)+(x+2)=33'], placeholder:'식을 써 보세요'}],
    wrong:[{re:/x-1|x\+1/, msg:'연속하는 홀수는 2씩 차이 나요. x − 2, x, x + 2로 써 보세요.'},{re:/\*|×/, msg:'문제는 세 수의 "합"이 33이에요. 곱이 아니라 더해요.'}],
    opts:[{t:'(x − 2) + x + (x + 2) = 33', r:'맞아요! 세 홀수의 합 = 33.'},{t:'(x − 1) + x + (x + 1) = 33', r:'x − 1, x + 1은 연속하는 정수일 때예요. 홀수는 2씩 차이 나요.'},{t:'(x − 2) × x × (x + 2) = 33', r:'합이 33이에요. 곱하기가 아니라 더하기예요.'}],
    right:'방정식: (x − 2) + x + (x + 2) = 33'}
  ],
  finalText:'<b class="k">답: 9, 11, 13</b><div class="recap">④ 풀기(계산): (x − 2) + x + (x + 2) = 3x = 33 → x = 11<br>⑤ 확인: 9 + 11 + 13 = 33 ✓<br>비교: 가장 작은 수를 x로 두면 x + (x + 2) + (x + 4) = 3x + 6 = 33이라 한 단계 더 걸려요.</div>'},

 {cat:'나이', problem:'현재 아버지 45세, 아들 13세입니다. 아버지의 나이가 아들의 3배가 되는 것은 몇 년 후인가요?',
  unk:{ask:EQW_UNK_ASK,
    fields:[{accept:[/^(?!.*(나이|아버지|아들|세)).*(몇|년|후|햇수|지나)/]}],
    wrong:[{re:/아버지|아들|나이/, msg:'아버지와 아들의 지금 나이는 이미 알려 줬어요. 문제 끝에서 "몇"이 붙은 말을 찾아보세요.'}],
    opts:[{t:'지금부터 몇 년 후인지', r:'맞아요! 문제 끝에서 "몇 년 후인가요?"를 물었어요.'},{t:'아버지의 지금 나이', r:'아버지는 45세라고 이미 알려 줬어요.'},{t:'아들의 지금 나이', r:'아들은 13세라고 이미 알려 줬어요.'}],
    right:'미지수: 지금부터 지난 햇수 → <b>x년 후</b>라고 놓아요.'},
  same:{opts:[{t:'(x년 후 아버지의 나이) = 3 × (x년 후 아들의 나이)', r:'맞아요! 같은 시점(x년 후)의 두 나이를 비교하고, 아버지 나이가 아들 나이의 3배예요.'},{t:'(지금 아버지의 나이 45) = 3 × (지금 아들의 나이 13)', r:'지금은 45와 39로 같지 않아요. "같아지는 때"를 찾는 문제예요.'},{t:'(x년 후 아버지의 나이) = (x년 후 아들의 나이)', r:'아버지가 계속 더 많아서 같아질 수 없어요. 문제는 "3배"가 되는 때예요.'}],
    right:'같은 두 양: <b>x년 후 아버지의 나이</b> 와 <b>3 × (x년 후 아들의 나이)</b>'},
  eq:[
   {lab:'각 값을 x로 나타내기', ask:'<b>x년 후</b>의 아버지 나이는 몇 세일까요? x로 나타내 보세요. (지금 45세)',
    fields:[{pre:'아버지 =', post:'세', accept:['45+x','x+45']}],
    wrong:[{re:/^45x$|^x45$/, msg:'45x는 45에 x를 곱한 거예요. 해마다 1살씩 늘어나니까 x년 지나면 45에 x를 "더해요".'},{re:/^45-x$/, msg:'나이는 시간이 지날수록 많아져요. 빼면 어려져요.'}],
    opts:[{t:'45 + x (세)', r:'맞아요! 지금 나이에 x년을 더해요.'},{t:'45 × x (세)', r:'x년 후라고 나이가 x배가 되지는 않아요. 1년이면 46세, 2년이면 47세, 곱이 아니라 더하기예요.'},{t:'45 − x (세)', r:'x년이 지나면 나이는 늘어나요. 빼면 어려져요.'}],
    right:'x년 후 아버지 = 45 + x, 아들 = 13 + x'},
   {lab:'"="로 잇기', ask:'x년 후 아들은 13 + x세예요. 같은 두 양(아버지 나이, 아들 나이의 3배)을 "="로 이어 식을 세워 보세요.',
    fields:[{wide:true, accept:['45+x=3(13+x)','3(13+x)=45+x','x+45=3(x+13)','3(x+13)=x+45','45+x=3*(13+x)','3*(13+x)=45+x'], placeholder:'식을 써 보세요'}],
    wrong:[{re:/^45\+x=3\*?13\+x$|^45\+x=39\+x$/, msg:'3배는 x년 후 아들 나이 "전체"(13+x)에 곱해야 해요. 괄호로 묶어서 3(13+x)로 써 보세요.'}],
    opts:[{t:'45 + x = 3(13 + x)', r:'맞아요! 아버지 = 아들의 3배. 아들 나이 전체에 3을 곱해요.'},{t:'45 + x = 3 × 13 + x', r:'3을 13에만 곱했어요. x년 후 아들 나이는 13+x 전체라서 3(13+x)이에요.'},{t:'3(45 + x) = 13 + x', r:'3배가 되는 쪽이 바뀌었어요. 3배가 되는 것은 아버지가 아니라 아들 나이예요.'}],
    right:'방정식: 45 + x = 3(13 + x)'}
  ],
  finalText:'<b class="k">답: 3년 후</b><div class="recap">④ 풀기(계산): 45 + x = 39 + 3x → 6 = 2x → x = 3<br>⑤ 확인: 3년 후 아버지 48세, 아들 16세, 16 × 3 = 48 ✓</div>'},

 {cat:'배정(과부족)', problem:'학생들이 의자에 앉는데, 한 의자에 3명씩 앉으면 8명이 앉지 못하고, 4명씩 앉으면 의자가 2개 남습니다. 의자는 모두 몇 개일까요?',
  unk:{ask:EQW_UNK_ASK,
    fields:[{accept:[/^(?!.*(학생|사람|앉는|명)).*의자/]}],
    wrong:[{re:/학생/, msg:'학생 수는 구하라고 하지 않았어요. 문제 끝 "의자는 모두 몇 개일까요?"를 보세요.'}],
    opts:[{t:'의자의 수', r:'맞아요! 문제 끝에서 "의자는 모두 몇 개"를 물었어요.'},{t:'학생의 수', r:'학생 수는 구하라고 하지 않았어요. 질문은 의자 수예요.'},{t:'한 의자에 앉는 사람 수', r:'3명씩, 4명씩은 이미 알려 줬어요.'}],
    right:'미지수: 의자의 수 → <b>x개</b>라고 놓아요.'},
  same:{opts:[{t:'(의자에 3명씩 앉을 때의 학생 수) = (의자에 4명씩 앉을 때의 학생 수)', r:'맞아요! 앉는 방법이 달라도 학생은 같은 학생들이라 학생 수는 같아요.'},{t:'(의자에 3명씩 앉을 때 사용한 의자 수) = (의자에 4명씩 앉을 때 사용한 의자 수)', r:'4명씩 앉을 때는 의자가 2개 남아서 사용한 의자 수가 달라요. 변하지 않는 것은 학생 수예요.'},{t:'(앉지 못한 학생 8명) = (남은 의자 2개)', r:'사람 수와 의자 수는 서로 다른 것이라 같다고 할 수 없어요.'}],
    right:'같은 두 양: <b>(의자에 3명씩 앉을 때의 학생 수)</b> 와 <b>(의자에 4명씩 앉을 때의 학생 수)</b>'},
  eq:[
   {lab:'각 값을 x로 나타내기', ask:'의자가 x개일 때 3명씩 앉히면 앉은 학생은 3 × x명이고, 앉지 못한 학생이 8명 더 있어요. <b>전체 학생 수</b>는?',
    fields:[{pre:'학생 =', post:'명', accept:['3x+8','8+3x']}],
    wrong:[{re:/^3x-8$/, msg:'앉지 못한 8명도 학생이에요. 앉은 학생에 8명을 "더해야" 전체 학생 수예요.'},{re:/^3\(x\+8\)$/, msg:'8은 의자 수가 아니라 학생 수예요. 3x에 8을 더해요.'}],
    opts:[{t:'3x + 8 (명)', r:'맞아요! 앉은 학생 3x명 + 앉지 못한 8명.'},{t:'3x − 8 (명)', r:'앉지 못한 학생도 전체 학생에 들어가요. 빼지 않고 더해요.'},{t:'3(x + 8) (명)', r:'8은 의자 수가 아니라 학생 수예요. 3을 곱하는 것은 의자 x개에만 해당돼요.'}],
    right:'의자에 3명씩 앉을 때 학생 수 = 3x + 8'},
   {lab:'각 값을 x로 나타내기', ask:'4명씩 앉으면 의자가 2개 남으니 학생이 앉은 의자는 (x − 2)개예요. 이때 <b>전체 학생 수</b>는?',
    fields:[{pre:'학생 =', post:'명', accept:['4(x-2)','4*(x-2)','(x-2)*4','(x-2)4','4x-8']}],
    wrong:[{re:/^4x-2$/, msg:'2개는 의자 수에서 빼야 해요. 4를 (x − 2) 전체에 곱해서 4(x − 2)로 써 보세요.'},{re:/^4\(x\+2\)$/, msg:'의자가 2개 "남았으니" 앉은 의자는 x + 2가 아니라 x − 2개예요.'}],
    opts:[{t:'4(x − 2) (명)', r:'맞아요! 앉은 의자 (x − 2)개에 4명씩.'},{t:'4x − 2 (명)', r:'2는 남은 "의자" 수예요. 학생 수에서 2를 빼면 안 되고, 의자 수에서 빼서 4(x − 2)예요.'},{t:'4(x + 2) (명)', r:'의자가 2개 남았으니 앉은 의자는 x보다 2개 적어요.'}],
    right:'의자에 4명씩 앉을 때 학생 수 = 4(x − 2)'},
   {lab:'"="로 잇기', ask:'같은 두 양 <b>(의자에 3명씩 앉을 때의 학생 수) = (의자에 4명씩 앉을 때의 학생 수)</b>를 식으로 세워 보세요.',
    fields:[{wide:true, accept:['3x+8=4(x-2)','4(x-2)=3x+8','3x+8=4x-8','4x-8=3x+8','3x+8=4*(x-2)','4*(x-2)=3x+8'], placeholder:'식을 써 보세요'}],
    wrong:[{re:/^3x-8=/, msg:'앉지 못한 8명은 더해야 해요. 3x + 8로 써 보세요.'},{re:/=4x-2$/, msg:'4명씩 앉는 쪽은 4(x − 2)예요. 2는 의자 수에서 빼요.'}],
    opts:[{t:'3x + 8 = 4(x − 2)', r:'맞아요! 학생 수를 두 가지 방법으로 쓴 두 값이 같아요.'},{t:'3x + 8 = 4x − 2', r:'4명씩 앉는 쪽은 4(x − 2)=4x − 8이에요. 2는 의자 수에서 빼고 난 뒤에 4를 곱해요.'},{t:'3x − 8 = 4(x − 2)', r:'앉지 못한 8명은 학생 수에 더해야 해요.'}],
    right:'방정식: 3x + 8 = 4(x − 2)'}
  ],
  finalText:'<b class="k">답: 의자 16개</b><div class="recap">④ 풀기(계산): 3x + 8 = 4x − 8 → 16 = x<br>⑤ 확인: 학생 수 3 × 16 + 8 = 56, 4 × (16 − 2) = 56 ✓</div>'},

 {cat:'요금(택시)', problem:'A 택시는 기본요금 3,000원에 1km마다 500원이 추가되고, B 택시는 기본요금 2,000원에 1km마다 600원이 추가됩니다. 몇 km를 가면 두 택시의 요금이 같아질까요?',
  unk:{ask:EQW_UNK_ASK,
    fields:[{accept:[/^(?!.*요금).*(거리|k|간|가면|몇)/]}],
    wrong:[{re:/요금|원/, msg:'요금은 같아지는 값이지 묻는 것이 아니에요. 문제 끝 "몇 km를 가면"을 보세요.'}],
    opts:[{t:'택시를 탄 거리(km)', r:'맞아요! 문제 끝에서 "몇 km를 가면"을 물었어요.'},{t:'A 택시의 요금', r:'요금은 거리에 따라 달라지는 값이에요. 묻는 것은 두 요금이 같아지는 "거리"예요.'},{t:'B 택시의 기본요금', r:'기본요금 2,000원은 이미 알려 줬어요.'}],
    right:'미지수: 택시를 탄 거리 → <b>x km</b>라고 놓아요.'},
  same:{opts:[{t:'(A 택시의 요금) = (B 택시의 요금)', r:'맞아요! "요금이 같아진다"는 말이 같은 두 양을 알려 줘요. 그 요금을 각각 거리 x로 나타내 볼 거예요.'},{t:'(A 택시의 기본요금) = (B 택시의 기본요금)', r:'기본요금은 3,000원과 2,000원으로 이미 달라요. 거리가 늘면서 "전체 요금"이 같아지는 때를 찾아요.'},{t:'(A 택시의 1km당 요금) = (B 택시의 1km당 요금)', r:'500원과 600원으로 정해져 있어서 같지 않아요.'}],
    right:'같은 두 양: <b>(A 택시의 요금)</b> 과 <b>(B 택시의 요금)</b>'},
  eq:[
   {lab:'각 값을 x로 나타내기', ask:'x km를 가면 <b>A 택시의 요금</b>은 몇 원일까요? (기본요금 3,000원, 1km마다 500원)',
    fields:[{pre:'A =', post:'원', accept:['3000+500x','500x+3000']}],
    wrong:[{re:/^3000x\+500$|^500x3000$/, msg:'기본요금 3,000원은 한 번만 내요. 거리 x는 1km당 요금 500원에 곱해요.'},{re:/^3500x$/, msg:'3,000원과 500원을 합쳐서 x를 곱하면 안 돼요. 기본요금은 한 번만 내요.'}],
    opts:[{t:'3,000 + 500x (원)', r:'맞아요! 기본요금 + (1km당 요금 × 거리).'},{t:'3,000x + 500 (원)', r:'기본요금에 거리를 곱하면 안 돼요. 거리 x는 1km당 요금 500원에 곱해요.'},{t:'3,500x (원)', r:'기본요금 3,000원은 한 번만 내요. 거리와 곱해지는 것은 500원뿐이에요.'}],
    right:'A 택시의 요금 = 3,000 + 500x'},
   {lab:'각 값을 x로 나타내기', ask:'x km를 가면 <b>B 택시의 요금</b>은 몇 원일까요? (기본요금 2,000원, 1km마다 600원)',
    fields:[{pre:'B =', post:'원', accept:['2000+600x','600x+2000']}],
    wrong:[{re:/^2000x\+600$/, msg:'기본요금 2,000원은 한 번만 내요. 거리 x는 1km당 요금 600원에 곱해요.'}],
    opts:[{t:'2,000 + 600x (원)', r:'맞아요! 기본요금 + (1km당 요금 × 거리).'},{t:'2,000x + 600 (원)', r:'기본요금에 거리를 곱하면 안 돼요.'},{t:'2,600x (원)', r:'기본요금은 한 번만 내요. 거리와 곱해지는 것은 600원뿐이에요.'}],
    right:'B 택시의 요금 = 2,000 + 600x'},
   {lab:'"="로 잇기', ask:'같은 두 양 <b>(A 택시의 요금) = (B 택시의 요금)</b>을 식으로 세워 보세요.',
    fields:[{wide:true, accept:['3000+500x=2000+600x','2000+600x=3000+500x','500x+3000=600x+2000','600x+2000=500x+3000'], placeholder:'식을 써 보세요'}],
    wrong:[{re:/^3000\+600x=2000\+500x$/, msg:'A 택시는 1km당 500원, B 택시는 600원이에요. 거리에 곱하는 수가 서로 바뀌었어요.'}],
    opts:[{t:'3,000 + 500x = 2,000 + 600x', r:'맞아요! (A 택시의 요금) = (B 택시의 요금).'},{t:'3,000 + 600x = 2,000 + 500x', r:'A 택시는 1km당 500원, B 택시는 600원이에요. 서로 바뀌었어요.'},{t:'3,000 + 500x = 600x', r:'B 택시의 기본요금 2,000원이 빠졌어요.'}],
    right:'방정식: 3,000 + 500x = 2,000 + 600x'}
  ],
  finalText:'<b class="k">답: 10km</b><div class="recap">④ 풀기(계산): 3,000 + 500x = 2,000 + 600x → 1,000 = 100x → x = 10<br>⑤ 확인: 10km에서 A 3,000 + 5,000 = 8,000원, B 2,000 + 6,000 = 8,000원 ✓</div>'},

 {cat:'속도(왕복)', problem:'지수가 집에서 도서관까지 갈 때는 분속 60m로, 올 때는 분속 90m로 걸었더니 왕복하는 데 25분이 걸렸습니다. 집에서 도서관까지의 거리는 몇 m일까요?',
  unk:{ask:EQW_UNK_ASK,
    fields:[{accept:[/^(?!.*(시간|속력|분속)).*(거리|도서관)/]}],
    wrong:[{re:/시간|25/, msg:'걸린 시간 25분은 이미 알려 줬어요. 문제 끝 "거리는 몇 m"를 보세요.'},{re:/속력|분속|60|90/, msg:'속력은 이미 알려 줬어요. 문제 끝에서 "몇 m"가 붙은 말을 찾아보세요.'}],
    opts:[{t:'집에서 도서관까지의 거리', r:'맞아요! 문제 끝에서 "거리는 몇 m"를 물었어요.'},{t:'갈 때 걸린 시간', r:'갈 때와 올 때 걸린 시간의 합이 25분이라고만 알려 줬어요. 묻는 것은 거리예요.'},{t:'올 때의 속력', r:'올 때 속력은 분속 90m라고 이미 알려 줬어요.'}],
    right:'미지수: 집에서 도서관까지의 거리 → <b>x m</b>라고 놓아요.'},
  same:{opts:[{t:'(갈 때 걸린 시간) + (올 때 걸린 시간) = 25분', r:'맞아요! 왕복에 걸린 시간 25분은 갈 때와 올 때 시간을 더한 값이에요.'},{t:'(갈 때 걸린 시간) = (올 때 걸린 시간)', r:'속력이 60과 90으로 달라서 걸린 시간도 달라요.'},{t:'(갈 때 속력) + (올 때 속력) = 25분', r:'25분은 시간이에요. 속력을 더한 값이 아니에요.'}],
    right:'같은 두 양: <b>(갈 때 걸린 시간) + (올 때 걸린 시간)</b> 과 <b>25분</b>'},
  eq:[
   {lab:'각 값을 x로 나타내기', ask:'시간 = 거리 ÷ 속력이에요. 거리를 x m라 할 때 분속 60m로 <b>갈 때 걸린 시간</b>은 몇 분일까요?',
    fields:[{pre:'갈 때 =', post:'분', accept:['x/60']}],
    wrong:[{re:/^60x$|^x60$/, msg:'시간은 거리를 속력으로 "나눈" 값이에요. 곱하면 안 돼요.'},{re:/^60\/x$/, msg:'나누는 순서가 바뀌었어요. 거리 x를 속력 60으로 나눠요.'}],
    opts:[{t:eqwFr('x', 60) + ' (분)', r:'맞아요! 거리 ÷ 속력 = ' + eqwFr('x', 60) + '.'},{t:'60x (분)', r:'60x는 속력에 거리를 곱한 값이라 시간이 아니에요. 시간 = 거리 ÷ 속력이에요.'},{t:eqwFr(60, 'x') + ' (분)', r:'나누는 순서가 바뀌었어요. 거리 x를 속력 60으로 나눠요.'}],
    right:'갈 때 걸린 시간 = ' + eqwFr('x', 60)},
   {lab:'각 값을 x로 나타내기', ask:'같은 방법으로, 분속 90m로 <b>올 때 걸린 시간</b>은 몇 분일까요?',
    fields:[{pre:'올 때 =', post:'분', accept:['x/90']}],
    wrong:[{re:/^90x$|^x90$/, msg:'시간은 거리를 속력으로 "나눈" 값이에요.'}],
    opts:[{t:eqwFr('x', 90) + ' (분)', r:'맞아요! 거리 ÷ 속력 = ' + eqwFr('x', 90) + '.'},{t:'90x (분)', r:'시간 = 거리 ÷ 속력이에요. 곱하지 않고 나눠요.'},{t:eqwFr('x', 60) + ' (분)', r:'60은 갈 때의 속력이에요. 올 때는 분속 90m예요.'}],
    right:'올 때 걸린 시간 = ' + eqwFr('x', 90)},
   {lab:'"="로 잇기', ask:'같은 두 양 <b>(갈 때 걸린 시간) + (올 때 걸린 시간) = 25분</b>을 식으로 세워 보세요.',
    fields:[{wide:true, accept:['x/60+x/90=25','x/90+x/60=25','25=x/60+x/90'], placeholder:'식을 써 보세요'}],
    wrong:[{re:/^x\/60-x\/90=25$/, msg:'왕복 시간은 갈 때와 올 때를 "더한" 값이에요. 빼면 안 돼요.'}],
    opts:[{t:eqwFr('x', 60) + ' + ' + eqwFr('x', 90) + ' = 25', r:'맞아요! (갈 때 시간) + (올 때 시간) = 25분.'},{t:eqwFr('x', 60) + ' − ' + eqwFr('x', 90) + ' = 25', r:'왕복 시간은 갈 때와 올 때를 더한 값이에요. 빼면 두 시간의 차가 돼요.'},{t:'60x + 90x = 25', r:'60x, 90x는 시간이 아니에요. 시간은 거리 ÷ 속력이에요.'}],
    right:'방정식: ' + eqwFr('x', 60) + ' + ' + eqwFr('x', 90) + ' = 25'}
  ],
  finalText:'<b class="k">답: 900m</b><div class="recap">④ 풀기(계산): ' + eqwFr('3x', 180) + ' + ' + eqwFr('2x', 180) + ' = 25 → ' + eqwFr('5x', 180) + ' = 25 → x = 900<br>⑤ 확인: 갈 때 900 ÷ 60 = 15분, 올 때 900 ÷ 90 = 10분, 15 + 10 = 25분 ✓</div>'},

 {cat:'일(함께 일하기)', problem:'어떤 일을 A 혼자 하면 10일, B 혼자 하면 15일이 걸립니다. 두 사람이 함께 하면 며칠이 걸릴까요?',
  unk:{ask:EQW_UNK_ASK,
    fields:[{accept:[/^(?!.*혼자).*(함께|같이|둘이|며칠|걸리|날|일수)/]}],
    wrong:[{re:/혼자|10|15/, msg:'혼자 하는 날 수는 이미 알려 줬어요. 문제 끝 "함께 하면 며칠"을 보세요.'}],
    opts:[{t:'두 사람이 함께 일한 날 수', r:'맞아요! 문제 끝에서 "함께 하면 며칠"을 물었어요.'},{t:'A가 혼자 일하는 날 수', r:'A는 혼자 하면 10일이라고 이미 알려 줬어요.'},{t:'전체 일의 양', r:'전체 일의 양은 구하라고 하지 않았어요. 질문은 날 수예요.'}],
    right:'미지수: 두 사람이 함께 일한 날 수 → <b>x일</b>이라고 놓아요.'},
  same:{opts:[{t:'(A가 한 일의 양) + (B가 한 일의 양) = 전체 일의 양 1', r:'맞아요! 함께 끝냈다는 건 둘이 한 일을 더하면 전체 일(1)이 된다는 뜻이에요. 전체를 1로 두면 분수로 나누어 더하기 쉬워요.'},{t:'(A가 걸린 날 수) = (B가 걸린 날 수)', r:'혼자 할 때는 10일과 15일로 날 수가 달라요.'},{t:'(A가 한 일의 양) = (B가 한 일의 양)', r:'A가 더 빨라서 같은 날 동안 한 일의 양이 달라요.'}],
    right:'같은 두 양: <b>(A가 한 일의 양) + (B가 한 일의 양)</b> 과 <b>전체 일의 양 1</b>'},
  eq:[
   {lab:'각 값을 x로 나타내기', ask:'전체 일을 1이라 하면 A는 하루에 ' + eqwFr(1, 10) + '을 해요. 함께 x일 일했다면 <b>A가 한 일의 양</b>은 얼마일까요?',
    fields:[{pre:'A =', accept:['x/10','1/10x','(1/10)x','0.1x','x*1/10','1/10*x']}],
    wrong:[{re:/^10x$|^x10$/, msg:'하루에 ' + eqwFr(1, 10) + '씩이니 x일이면 x × ' + eqwFr(1, 10) + ' = ' + eqwFr('x', 10) + '이에요. 10x가 아니에요.'},{re:/^x\/15$/, msg:'15일은 B가 혼자 하는 날 수예요. A는 10일이에요.'}],
    opts:[{t:eqwFr('x', 10), r:'맞아요! 하루에 ' + eqwFr(1, 10) + '씩 x일 동안 하니까 ' + eqwFr('x', 10) + '.'},{t:'10x', r:'하루에 한 일은 ' + eqwFr(1, 10) + '이라서, 10을 곱하면 안 돼요.'},{t:eqwFr('x', 15), r:'15일은 B 혼자 하는 날 수예요.'}],
    right:'A가 한 일 = ' + eqwFr('x', 10) + ', B가 한 일 = ' + eqwFr('x', 15)},
   {lab:'"="로 잇기', ask:'같은 두 양 <b>(A가 한 일의 양) + (B가 한 일의 양) = 전체 일의 양 1</b>을 식으로 세워 보세요. (B가 한 일은 ' + eqwFr('x', 15) + ')',
    fields:[{wide:true, accept:['x/10+x/15=1','1=x/10+x/15','x/15+x/10=1','(1/10)x+(1/15)x=1'], placeholder:'식을 써 보세요'}],
    wrong:[{re:/^x\/10\+x\/15=(?!1$)/, msg:'전체 일의 양을 1로 두었으니 오른쪽은 1이에요.'}],
    opts:[{t:eqwFr('x', 10) + ' + ' + eqwFr('x', 15) + ' = 1', r:'맞아요! (A가 한 일 + B가 한 일) = 전체 일 1.'},{t:eqwFr('x', 10) + ' + ' + eqwFr('x', 15) + ' = 2', r:'전체 일을 1로 두었어요. 2가 아니라 1이에요.'},{t:'10x + 15x = 1', r:'10x, 15x는 한 일의 양이 아니에요. 한 일은 ' + eqwFr('x', 10) + ', ' + eqwFr('x', 15) + '이에요.'}],
    right:'방정식: ' + eqwFr('x', 10) + ' + ' + eqwFr('x', 15) + ' = 1'}
  ],
  finalText:'<b class="k">답: 6일</b><div class="recap">④ 풀기(계산): ' + eqwFr('3x', 30) + ' + ' + eqwFr('2x', 30) + ' = 1 → ' + eqwFr('5x', 30) + ' = 1 → x = 6<br>⑤ 확인: ' + eqwFr(6, 10) + ' + ' + eqwFr(6, 15) + ' = ' + eqwFr(3, 5) + ' + ' + eqwFr(2, 5) + ' = 1 ✓</div>'},

 {cat:'농도(물 넣기)', problem:'8% 소금물 200g에 물을 넣어 5% 소금물을 만들려고 합니다. 넣어야 하는 물은 몇 g일까요?',
  unk:{ask:EQW_UNK_ASK,
    fields:[{accept:[/^(?!.*소금).*(물|넣)/]}],
    wrong:[{re:/소금/, msg:'소금의 양은 구하라고 하지 않았어요. 문제 끝 "넣어야 하는 물은 몇 g"을 보세요.'},{re:/200|농도|8|5/, msg:'이미 알려 준 값이에요. 문제 끝 "넣어야 하는 물은 몇 g"을 보세요.'}],
    opts:[{t:'넣어야 하는 물의 양', r:'맞아요! 문제 끝에서 "넣어야 하는 물은 몇 g"을 물었어요.'},{t:'처음 소금물 속 소금의 양', r:'소금의 양은 구하라고 하지 않았어요. 질문은 넣는 물의 양이에요.'},{t:'나중 소금물의 농도', r:'나중 농도 5%는 이미 알려 줬어요.'}],
    right:'미지수: 넣는 물의 양 → <b>x g</b>이라고 놓아요.'},
  same:{opts:[{t:'(물 넣기 전 소금의 양) = (물 넣은 뒤 소금의 양)', r:'맞아요! 물을 넣어도 소금은 늘거나 줄지 않아서, 넣기 전과 넣은 뒤의 소금의 양은 같아요.'},{t:'(물 넣기 전 소금물의 양) = (물 넣은 뒤 소금물의 양)', r:'물을 넣으면 소금물의 양은 늘어나요. 변하지 않는 것은 소금의 양이에요.'},{t:'(물 넣기 전 농도 8%) = (물 넣은 뒤 농도 5%)', r:'물을 넣으면 농도가 묽어져서 8%가 5%로 달라져요.'}],
    right:'같은 두 양: <b>(물 넣기 전 소금의 양)</b> 과 <b>(물 넣은 뒤 소금의 양)</b>'},
  eq:[
   {lab:'각 값을 x로 나타내기', ask:'처음 8% 소금물 200g 속 <b>소금의 양</b>은 몇 g일까요? (소금의 양 = 소금물의 양 × 농도, 8% = 0.08)',
    fields:[{pre:'처음 소금 =', post:'g', accept:['200*0.08','0.08*200','16']}],
    wrong:[{re:/^200\*8$|^1600$/, msg:'8%는 0.08이에요. 8이 아니라 0.08을 곱해요.'},{re:/^200\+/, msg:'소금의 양은 소금물의 양에 농도를 "곱해서" 구해요.'}],
    opts:[{t:'200 × 0.08 (g)', r:'맞아요! 소금의 양 = 소금물의 양 × 농도.'},{t:'200 × 8 (g)', r:'8%는 8이 아니라 0.08이에요.'},{t:'200 + 0.08 (g)', r:'소금의 양은 더하는 것이 아니라 소금물의 양에 농도를 곱해서 구해요.'}],
    right:'처음 소금의 양 = 200 × 0.08'},
   {lab:'각 값을 x로 나타내기', ask:'물 x g을 넣으면 소금물은 (200 + x)g이 되고 농도는 5%(0.05)예요. 물을 넣은 뒤 <b>소금의 양</b>은 몇 g일까요?',
    fields:[{wide:true, pre:'나중 소금 =', post:'g', accept:['(200+x)*0.05','0.05(200+x)','(200+x)0.05','0.05*(200+x)']}],
    wrong:[{re:/^200\*0\.05$/, msg:'물을 넣은 뒤 소금물은 200g이 아니라 (200 + x)g이에요.'},{re:/0\.08/, msg:'물을 넣은 뒤 농도는 5%(0.05)예요.'}],
    opts:[{t:'(200 + x) × 0.05 (g)', r:'맞아요! 소금의 양 = (물 넣은 뒤 소금물의 양) × 농도.'},{t:'200 × 0.05 (g)', r:'물을 넣었으니 소금물의 양은 200g보다 늘어서 (200 + x)g이에요.'},{t:'(200 + x) × 0.08 (g)', r:'물을 넣은 뒤의 농도는 5%(0.05)예요. 0.08은 처음 농도예요.'}],
    right:'나중 소금의 양 = (200 + x) × 0.05'},
   {lab:'"="로 잇기', ask:'같은 두 양 <b>(물 넣기 전 소금의 양) = (물 넣은 뒤 소금의 양)</b>을 식으로 세워 보세요.',
    fields:[{wide:true, accept:['200*0.08=(200+x)*0.05','(200+x)*0.05=200*0.08','16=(200+x)*0.05','0.08*200=0.05(200+x)','200*0.08=0.05(200+x)','(200+x)*0.05=16'], placeholder:'식을 써 보세요'}],
    wrong:[{re:/^200\*0\.05=/, msg:'처음 소금의 양은 200 × 0.08이에요. 0.05는 나중 농도예요.'}],
    opts:[{t:'200 × 0.08 = (200 + x) × 0.05', r:'맞아요! (넣기 전 소금의 양) = (넣은 뒤 소금의 양).'},{t:'200 × 0.08 = x × 0.05', r:'물을 넣은 뒤 소금물은 x g이 아니라 (200 + x)g이에요.'},{t:'200 × 0.05 = (200 + x) × 0.08', r:'농도가 서로 바뀌었어요. 처음은 0.08, 나중은 0.05예요.'}],
    right:'방정식: 200 × 0.08 = (200 + x) × 0.05'}
  ],
  finalText:'<b class="k">답: 물 120g</b><div class="recap">④ 풀기(계산): 16 = 10 + 0.05x → 6 = 0.05x → x = 120<br>⑤ 확인: 소금물 200 + 120 = 320g, 소금 16g, 16 ÷ 320 = 0.05 = 5% ✓</div>'},

 {cat:'원가·정가', problem:'원가에 20%의 이익을 붙여 정가를 정하고, 정가에서 600원을 깎아 팔았더니 600원의 이익이 남았습니다. 이 물건의 원가는 얼마일까요?',
  unk:{ask:EQW_UNK_ASK,
    fields:[{accept:[/^(?!.*(정가|이익|판매)).*원가/]}],
    wrong:[{re:/정가|판매|이익|600/, msg:'정가·판매가·이익은 구하라고 하지 않았어요. 문제 끝 "원가는 얼마"를 보세요.'}],
    opts:[{t:'물건의 원가', r:'맞아요! 문제 끝에서 "원가는 얼마"를 물었어요.'},{t:'물건의 정가', r:'정가는 원가에서 20%를 붙인 값이라 원가를 알아야 알 수 있어요. 묻는 것은 원가예요.'},{t:'남은 이익', r:'이익 600원은 이미 알려 줬어요.'}],
    right:'미지수: 물건의 원가 → <b>x원</b>이라고 놓아요.'},
  same:{opts:[{t:'(판매가) − (원가) = 이익 600원', r:'맞아요! 이익은 판매가에서 원가를 뺀 값이고, 그 값이 600원이에요.'},{t:'(정가) − (원가) = 이익 600원', r:'정가에서 600원을 깎아 팔았어요. 이익 600원은 정가가 아니라 실제로 판 값(판매가)에서 원가를 뺀 값이에요.'},{t:'(원가) = (판매가)', r:'이익이 남았으니 판매가가 원가보다 커요. 같지 않아요.'}],
    right:'같은 두 양: <b>(판매가) − (원가)</b> 와 <b>이익 600원</b>'},
  eq:[
   {lab:'각 값을 x로 나타내기', ask:'원가가 x원일 때 20%의 이익을 붙인 <b>정가</b>는 몇 원일까요? (20% = 0.2)',
    fields:[{pre:'정가 =', post:'원', accept:['1.2x','x*1.2','1.2*x','x+0.2x','x+x*0.2']}],
    wrong:[{re:/^0\.2x$/, msg:'0.2x는 이익만이에요. 정가는 원가 x에 이익 0.2x를 더한 값이에요.'},{re:/^x\+20$/, msg:'20%는 20원이 아니라 원가의 0.2배예요.'}],
    opts:[{t:'1.2x (원)', r:'맞아요! 정가 = 원가 + 이익 = x + 0.2x = 1.2x.'},{t:'0.2x (원)', r:'0.2x는 이익만이에요. 정가는 원가 x에 이익을 더한 값이에요.'},{t:'x + 20 (원)', r:'20%는 20원이 아니라 원가의 0.2배예요.'}],
    right:'정가 = 1.2x'},
   {lab:'각 값을 x로 나타내기', ask:'정가에서 600원을 깎아 팔았어요. <b>판매가</b>는 몇 원일까요? (정가 1.2x원)',
    fields:[{pre:'판매가 =', post:'원', accept:['1.2x-600','x*1.2-600','-600+1.2x']}],
    wrong:[{re:/^1\.2x\+600$/, msg:'"깎아" 팔았으니 정가보다 싸져요. 빼야 해요.'}],
    opts:[{t:'1.2x − 600 (원)', r:'맞아요! 판매가 = 정가 − 600.'},{t:'1.2x + 600 (원)', r:'"깎아" 팔았으니 정가보다 싸져요. 더하면 안 돼요.'},{t:'x − 600 (원)', r:'깎는 것은 원가가 아니라 정가예요. 정가는 1.2x예요.'}],
    right:'판매가 = 1.2x − 600'},
   {lab:'"="로 잇기', ask:'같은 두 양 <b>(판매가) − (원가) = 이익 600원</b>을 식으로 세워 보세요. (판매가 1.2x − 600, 원가 x)',
    fields:[{wide:true, accept:['1.2x-600-x=600','(1.2x-600)-x=600','600=1.2x-600-x','0.2x-600=600','1.2x-600=x+600'], placeholder:'식을 써 보세요'}],
    wrong:[{re:/^1\.2x-x=600$/, msg:'1.2x는 정가예요. 실제로 판 값은 600원을 깎은 1.2x − 600이에요.'}],
    opts:[{t:'(1.2x − 600) − x = 600', r:'맞아요! (판매가) − (원가) = 이익 600원.'},{t:'1.2x − 600 = 600', r:'원가 x를 빼지 않았어요. 이익은 판매가에서 원가를 뺀 값이에요.'},{t:'1.2x − x = 600', r:'정가 1.2x가 아니라 600원을 깎은 판매가 1.2x − 600으로 이익을 계산해야 해요.'}],
    right:'방정식: (1.2x − 600) − x = 600'}
  ],
  finalText:'<b class="k">답: 6,000원</b><div class="recap">④ 풀기(계산): 0.2x − 600 = 600 → 0.2x = 1,200 → x = 6,000<br>⑤ 확인: 정가 7,200원, 판매가 7,200 − 600 = 6,600원, 이익 6,600 − 6,000 = 600원 ✓</div>'},

 {cat:'증가율', problem:'작년 어느 학교의 학생 수는 400명이었습니다. 올해는 남학생이 10% 늘고 여학생이 5% 줄어 전체가 10명 늘었습니다. 작년 남학생은 몇 명일까요?',
  unk:{ask:EQW_UNK_ASK,
    fields:[{accept:[/^(?!.*(올해|여학생)).*남/]}],
    wrong:[{re:/여학생/, msg:'여학생 수는 구하라고 하지 않았어요. 문제 끝 "작년 남학생은 몇 명"을 보세요.'},{re:/올해/, msg:'올해 수는 변한 뒤의 값이에요. 문제 끝 "작년 남학생은 몇 명"을 보세요.'}],
    opts:[{t:'작년 남학생 수', r:'맞아요! 문제 끝에서 "작년 남학생은 몇 명"을 물었어요.'},{t:'올해 남학생 수', r:'올해 수는 작년 수에서 10%가 늘어난 값이에요. 묻는 것은 작년 남학생 수예요.'},{t:'작년 여학생 수', r:'여학생 수는 구하라고 하지 않았어요. 다만 전체 400명에서 남학생을 뺀 값으로 나타낼 수 있어요.'}],
    right:'미지수: 작년 남학생 수 → <b>x명</b>이라고 놓아요. (작년 여학생은 400 − x명)'},
  same:{opts:[{t:'(올해 남학생 수) + (올해 여학생 수) = 400 + 10', r:'맞아요! 올해 전체는 작년 전체 400명보다 10명 늘어난 410명이에요.'},{t:'(올해 남학생 수) = (올해 여학생 수)', r:'남녀 학생 수가 같다는 말은 어디에도 없어요.'},{t:'(작년 남학생 수) + (작년 여학생 수) = 400 + 10', r:'작년 전체는 400명이에요. 10명 늘어난 것은 올해 전체예요.'}],
    right:'같은 두 양: <b>(올해 남학생 수) + (올해 여학생 수)</b> 와 <b>400 + 10</b>'},
  eq:[
   {lab:'각 값을 x로 나타내기', ask:'작년 남학생이 x명이고 전체가 400명이면 <b>작년 여학생</b>은 몇 명일까요?',
    fields:[{pre:'여학생 =', post:'명', accept:['400-x']}],
    wrong:[{re:/^x-400$/, msg:'전체 400명에서 남학생 x명을 빼야 여학생이에요. 순서가 바뀌었어요.'},{re:/^400\+x$/, msg:'전체 400명 안에 남학생이 이미 들어 있어요. 더하면 400보다 커져요.'}],
    opts:[{t:'400 − x (명)', r:'맞아요! 전체 400명에서 남학생을 뺀 나머지가 여학생이에요.'},{t:'400 + x (명)', r:'전체에 남학생이 이미 들어 있어요. 더하면 400보다 커져요.'},{t:'x − 400 (명)', r:'순서가 바뀌었어요. 전체에서 남학생을 빼요.'}],
    right:'작년 남학생 = x, 작년 여학생 = 400 − x'},
   {lab:'각 값을 x로 나타내기', ask:'남학생이 10% 늘고 여학생이 5% 줄었어요. <b>올해 남학생</b>과 <b>올해 여학생</b>은 각각 몇 명일까요? (10% 늘면 1.1배, 5% 줄면 0.95배)',
    fields:[{pre:'올해 남 =', post:'명', accept:['1.1x','x*1.1','1.1*x']},{pre:'올해 여 =', post:'명', accept:['0.95(400-x)','0.95*(400-x)','(400-x)*0.95','(400-x)0.95']}],
    wrong:[{re:/^1\.05|^0\.9/, msg:'10% 늘면 1.1배, 5% 줄면 0.95배예요.'}],
    opts:[{t:'남 1.1x명, 여 0.95(400 − x)명', r:'맞아요! 늘면 100% + 10% = 1.1배, 줄면 100% − 5% = 0.95배예요.'},{t:'남 1.1x명, 여 1.05(400 − x)명', r:'줄어든다는 것은 100% − 5% = 95%가 남는 거예요. 1.05는 5%가 "늘어난" 값이에요.'},{t:'남 1.1x명, 여 0.05(400 − x)명', r:'0.05는 줄어든 양이에요. 올해 여학생은 95%가 남은 0.95배예요.'}],
    right:'올해 남학생 = 1.1x, 올해 여학생 = 0.95(400 − x)'},
   {lab:'"="로 잇기', ask:'같은 두 양 <b>(올해 남학생) + (올해 여학생) = 400 + 10</b>을 식으로 세워 보세요.',
    fields:[{wide:true, accept:['1.1x+0.95(400-x)=410','410=1.1x+0.95(400-x)','1.1x+0.95(400-x)=400+10','1.1*x+0.95*(400-x)=410'], placeholder:'식을 써 보세요'}],
    wrong:[{re:/=10$/, msg:'10명은 늘어난 양이에요. 올해 전체는 400 + 10 = 410명이에요.'}],
    opts:[{t:'1.1x + 0.95(400 − x) = 410', r:'맞아요! 올해 남학생 + 올해 여학생 = 올해 전체 410명.'},{t:'1.1x + 0.95(400 − x) = 10', r:'10명은 늘어난 양이에요. 올해 전체는 400 + 10 = 410명이에요.'},{t:'1.1x + 0.05(400 − x) = 410', r:'여학생은 5% 줄었으니 0.95배예요. 0.05는 줄어든 양이에요.'}],
    right:'방정식: 1.1x + 0.95(400 − x) = 410'}
  ],
  finalText:'<b class="k">답: 작년 남학생 200명</b><div class="recap">④ 풀기(계산): 1.1x + 380 − 0.95x = 410 → 0.15x = 30 → x = 200<br>⑤ 확인: 올해 남학생 220명 + 올해 여학생 190명 = 410명 ✓</div>'}
];

// 풀이 A/B 단계 만들기
function eqwMk(c){
  var A = [Object.assign({g:'① 미지수는?', lab:'미지수 정하기'}, c.unk),
           Object.assign({g:'② 같은 값 두 개는?', lab:'같은 두 양 찾기', choiceFirst:true, ask:'이 문제에서 <b>같은 두 개의 양</b>을 문장으로 나타내 보세요. 어느 것일까요?'}, c.same)];
  var B = [Object.assign({g:'① 같은 두 양은?', lab:'같은 두 양 찾기', choiceFirst:true, ask:'먼저 문제에서 <b>같은 두 개의 양</b>을 찾아요. 문장으로 나타내면 어느 것일까요?'}, c.same),
           Object.assign({}, c.unk, {g:'② 없는 것은?', lab:'모르는 것(미지수) 찾기', ask:'방금 찾은 문장에서 <b>아직 값을 모르는 것(없는 것)</b>이 미지수예요. 무엇일까요? 짧게 써 보세요.'}, c.unkB || {})];
  var eq = c.eq.map(function(e){ return Object.assign({g:'③ 식으로 쓰기'}, e); });
  return {A: A.concat(eq), B: B.concat(eq)};
}

// 한 판(10문제)에서 A와 B를 5문제씩 섞어 배정
function eqwBalanced(n){
  var a = [], i;
  for(i = 0; i < n; i++) a.push(i < Math.ceil(n / 2) ? 'A' : 'B');
  for(i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
function eqwQuery(k){ var m = new RegExp('[?&]' + k + '=([^&#]*)').exec(location.search); return m ? m[1] : ''; }

function eqwNorm(s){ return String(s == null ? '' : s).replace(/\s+/g, '').replace(/,/g, '').replace(/[×·]/g, '*').replace(/−/g, '-').replace(/÷/g, '/').replace(/[원개분년세자루미터명g]+$/, '').toLowerCase(); }
function eqwFieldOk(f, v){ var n = eqwNorm(v); return f.accept.some(function(a){ return a instanceof RegExp ? a.test(n) : eqwNorm(a) === n; }); }
function eqwWrongMsg(st, v){ var n = eqwNorm(v); for(var i = 0; i < (st.wrong || []).length; i++){ if(st.wrong[i].re.test(n)) return st.wrong[i].msg; } return ''; }
function eqwShuffle(a){ a = a.slice(); for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
// 변수 x는 곱하기 기호(×)와 구별되도록 기울인 글씨체로 보여 준다. 태그 안쪽은 건드리지 않고 글 부분만 바꾼다.
function eqwVar(html){ return String(html).split(/(<[^>]+>)/).map(function(p){ return p.charAt(0) === '<' ? p : p.replace(/(^|[^A-Za-z])x(?![A-Za-z])/g, '$1<i class="eqw-x">x</i>'); }).join(''); }
function eqwEsc(s){ return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

function eqwInjectStyle(){
  if(document.getElementById('eqw-style')) return;
  var st = document.createElement('style'); st.id = 'eqw-style';
  st.textContent =
    '.eqw-walk{background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.3);border-radius:12px;padding:14px;color:#e2e8f0}'
  + '.eqw-dots{text-align:center;margin-bottom:10px}.eqw-dot{display:inline-block;width:14px;height:14px;border-radius:7px;margin:0 3px;background:rgba(255,255,255,.15)}.eqw-dot.cur{width:26px;background:#fde68a}.eqw-dot.done{background:#10b981}'
  + '.eqw-lab{font-family:Jua,sans-serif;font-size:.78rem;color:#6ee7b7;margin-bottom:6px}.eqw-lab .big{color:#fde68a;font-size:.95rem}'
  + '.eqw-ask{font-size:.9rem;margin-bottom:10px;line-height:1.8}'
  + '.eqw-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px}.eqw-row .pp{color:#94a3b8;font-size:.84rem}'
  + 'input.eqw-in{flex:1;min-width:120px;background:#0f172a;border:2px solid #475569;color:#e2e8f0;border-radius:8px;padding:9px 10px;font:inherit;font-size:.95rem}input.eqw-in:focus{outline:none;border-color:#fde68a}'
  + '.eqw-btn{display:block;width:100%;margin-top:10px;padding:11px;border:0;border-radius:10px;font-family:Jua,sans-serif;font-size:.92rem;color:#fff;background:linear-gradient(135deg,#065f46,#10b981);cursor:pointer}.eqw-btn.sub{background:#334155;font-size:.8rem;padding:8px}'
  + '.eqw-ch{display:block;width:100%;text-align:left;background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:10px;padding:11px 13px;margin-top:8px;font:inherit;font-size:.88rem;cursor:pointer;line-height:1.7}.eqw-ch:hover:not(:disabled){border-color:#fde68a}'
  + '.eqw-ch.ok{border-color:#10b981;background:rgba(16,185,129,.15)}.eqw-ch.no{border-color:#f87171;background:rgba(248,113,113,.12)}.eqw-ch:disabled{cursor:default}'
  + '.eqw-msg{margin-top:10px;font-size:.84rem;border-radius:8px;padding:10px 12px;line-height:1.8}.eqw-msg.bad{background:rgba(248,113,113,.1);border-left:3px solid #f87171}.eqw-msg.good{background:rgba(16,185,129,.12);border-left:3px solid #10b981}.eqw-msg.info{background:rgba(99,102,241,.1);border-left:3px solid #6366f1}'
  + '.eqw-final{margin-top:4px;background:rgba(253,230,138,.07);border:1px solid rgba(253,230,138,.3);border-radius:12px;padding:14px;font-size:.86rem;line-height:1.8}.eqw-final b.k{color:#fde68a}'
  + '.eqw-recap,.eqw-final .recap{background:rgba(0,0,0,.25);border-radius:8px;padding:8px 12px;margin:8px 0;font-size:.82rem}'
  + '.eqw-x{font-family:"Times New Roman",Georgia,serif;font-style:italic;font-weight:700;font-size:1.12em;padding:0 1px}'
  + '.eqw-tag{font-size:.68rem;color:#a5b4fc;margin-bottom:6px;font-family:Jua,sans-serif}';
  document.head.appendChild(st);
}

function eqwBox(){ return document.getElementById('cv-interactive'); }
function eqwStartStep(){
  var w = EQW.w, st = w.steps[w.i];
  w.tries = 0; w.msg = ''; w.msgKind = ''; w.picked = null; w.solved = false; w.last = '';
  w.mode = st.choiceFirst ? 'choice' : 'blank';
  w.order = st.choiceFirst ? eqwShuffle(st.opts.map(function(_, k){ return k; })) : null;
}
function eqwLoad(idx){
  var forced = eqwQuery('eqw'), style = EQW.styles[idx] || 'A';
  if(forced === 'A' || forced === 'B') style = forced;
  var c = EQW_CARDS[idx], m = eqwMk(c);
  EQW.w = {idx: idx, style: style, steps: m[style], i: 0, firsts: [], done: false, card: c};
  eqwStartStep(); eqwRender();
}
function eqwDots(){
  var w = EQW.w, h = '';
  w.steps.forEach(function(s, k){ var done = k < w.i || (k === w.i && (w.solved || w.picked !== null)); h += '<span class="eqw-dot ' + (done ? 'done' : k === w.i ? 'cur' : '') + '"></span>'; });
  return '<div class="eqw-dots">' + h + '</div>';
}
function eqwRender(){
  var w = EQW.w, box = eqwBox(), st = w.steps[w.i], tag = eqwQuery('eqw') ? '<div class="eqw-tag">(검토용 표시) 이번 풀이 ' + w.style + '</div>' : '';
  if(!box) return;
  if(w.done){
    var good = w.firsts.filter(Boolean).length;
    var recap = w.steps.filter(function(s){ return s.right; }).map(function(s){ return '<div>' + s.g + ' ' + s.right + '</div>'; }).join('');
    box.innerHTML = eqwVar('<div class="eqw-walk">' + tag + eqwDots().replace(/cur/g, 'done') + '<div class="eqw-final">' + w.card.finalText + '<div class="eqw-recap">' + recap + '</div><div style="color:#94a3b8;font-size:.8rem">첫 시도에 맞힌 단계: ' + good + ' / ' + w.steps.length + '</div></div><button class="eqw-btn sub" onclick="eqwLoad(' + w.idx + ')">🔄 처음부터 다시</button></div>');
    return;
  }
  var resolved = w.solved || w.picked !== null;
  var inner = tag + eqwDots() + '<div class="eqw-lab"><span class="big">' + st.g + '</span> &nbsp; ' + st.lab + ' (' + (w.i + 1) + ' / ' + w.steps.length + ')</div><div class="eqw-ask">' + st.ask + '</div>';
  if(w.mode === 'blank'){
    inner += '<div class="eqw-row">' + st.fields.map(function(f, k){
      return (f.pre ? '<span class="pp">' + f.pre + '</span>' : '') + '<input class="eqw-in" id="eqw-in' + k + '" autocomplete="off" onkeydown="if(event.key===\'Enter\')eqwSubmit()" ' + (resolved ? 'disabled value="' + eqwEsc(w.last) + '"' : '') + ' placeholder="' + eqwEsc(f.placeholder || '') + '"' + (f.wide ? ' style="min-width:220px"' : '') + '>' + (f.post ? '<span class="pp">' + f.post + '</span>' : '');
    }).join('') + '</div>';
    if(!resolved) inner += '<button class="eqw-btn" onclick="eqwSubmit()">확인</button><button class="eqw-btn sub" onclick="eqwToChoice()">잘 모르겠어요 🤔 (객관식으로 볼래요)</button>';
  } else {
    if(w.picked === null && !st.choiceFirst) inner += '<div class="eqw-msg info">객관식으로 바꿨어요. 가장 알맞은 것을 골라 보세요.</div>';
    inner += w.order.map(function(k){
      var cls = ''; if(w.picked !== null){ if(k === 0) cls = ' ok'; else if(w.picked === k) cls = ' no'; }
      return '<button class="eqw-ch' + cls + '"' + (w.picked !== null ? ' disabled' : '') + ' onclick="eqwPick(' + k + ')">' + st.opts[k].t + '</button>';
    }).join('');
    if(w.picked === null) inner += '<button class="eqw-btn sub" onclick="eqwReveal()">모범 답 보기</button>';
  }
  if(w.msg) inner += '<div class="eqw-msg ' + w.msgKind + '">' + w.msg + '</div>';
  if(resolved) inner += '<div class="eqw-msg good"><b>정리:</b> ' + st.right + '</div><button class="eqw-btn" onclick="eqwNext()">' + (w.i === w.steps.length - 1 ? '결과 보기 ➜' : '다음 ➜') + '</button>';
  box.innerHTML = eqwVar('<div class="eqw-walk">' + inner + '</div>');
  var first = document.getElementById('eqw-in0'); if(first && !resolved) first.focus();
}
function eqwSubmit(){
  var w = EQW.w, st = w.steps[w.i];
  var vals = st.fields.map(function(_, k){ return document.getElementById('eqw-in' + k).value; });
  if(vals.every(function(v){ return !String(v).trim(); })){ w.msg = '답을 먼저 써 보세요.'; w.msgKind = 'info'; eqwRender(); return; }
  w.tries++; w.last = vals.join(' ');
  if(st.fields.every(function(f, k){ return eqwFieldOk(f, vals[k]); })){ w.solved = true; w.firsts[w.i] = (w.tries === 1); w.msg = '맞았어요! 🎉'; w.msgKind = 'good'; eqwRender(); return; }
  var m = '';
  for(var k = 0; k < vals.length && !m; k++) m = eqwWrongMsg(st, vals[k]);
  if(w.tries >= 2){ eqwToChoice('두 번 틀렸어요. 괜찮아요, 같은 단계를 객관식으로 볼게요.'); return; }
  w.msg = (m || '아쉬워요. 다시 한 번 생각해 볼까요?') + ' (한 번 더 도전해요!)'; w.msgKind = 'bad'; eqwRender();
}
function eqwToChoice(msg){ var w = EQW.w, st = w.steps[w.i]; w.mode = 'choice'; w.order = eqwShuffle(st.opts.map(function(_, k){ return k; })); w.msg = msg || ''; w.msgKind = 'info'; eqwRender(); }
function eqwPick(k){ var w = EQW.w, st = w.steps[w.i]; w.picked = k; w.firsts[w.i] = (k === 0 && !!st.choiceFirst); w.msg = (k === 0 ? '맞았어요! ' : '아쉬워요. ') + st.opts[k].r; w.msgKind = k === 0 ? 'good' : 'bad'; eqwRender(); }
function eqwReveal(){ var w = EQW.w, st = w.steps[w.i]; w.picked = 0; w.firsts[w.i] = false; w.msg = '모범 답: ' + st.opts[0].t; w.msgKind = 'info'; eqwRender(); }
function eqwNext(){ var w = EQW.w; if(w.i === w.steps.length - 1){ w.done = true; eqwRender(); return; } w.i++; eqwStartStep(); eqwRender(); }

// 카드 보기 연결: 새 묶음일 때만 카드 아래 칸(cv-interactive)에 단계 풀이를 붙인다
function eqwOnCard(){
  if(typeof CS === 'undefined' || CS.set !== EQW_SET) return;
  var box = eqwBox(); if(!box) return;
  eqwInjectStyle();
  box.style.display = '';
  eqwLoad(CS.cur);
}
window.addEventListener('load', function(){
  if(typeof CARD_DATA === 'undefined' || typeof startCards !== 'function' || typeof renderCard !== 'function') return;
  CARD_DATA[EQW_SET] = EQW_CARDS.map(function(c, i){
    return {tag:'🕵️ 기본 ' + (i + 1) + '/10 · ' + c.cat, tagColor:'#7dd3fc', bg:'rgba(125,211,252,.07)', bd:'rgba(125,211,252,.25)',
      body:'<div style="font-size:.9rem;color:#e2e8f0;line-height:1.85;font-weight:600">' + eqwVar(c.problem) + '</div>'};
  });
  var s0 = startCards;
  startCards = function(set, from){ if(set === EQW_SET) EQW.styles = eqwBalanced(EQW_CARDS.length); s0(set, from); };
  var r0 = renderCard;
  renderCard = function(){ r0(); eqwOnCard(); };
});
