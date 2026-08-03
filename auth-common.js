// 모든 인증 관련 페이지(login/signup/pending/admin)와 index.html, jewish_math/index.html이 공유하는 헬퍼.
// firebase-config.js보다 나중에, Firebase compat SDK 스크립트들보다 나중에 로드해야 함.

firebase.initializeApp(window.FIREBASE_CONFIG);
const auth = firebase.auth();
const db = firebase.firestore();

const SESSION_COOKIE = "td_session";

function setSessionCookie(idToken) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_COOKIE}=${idToken}; Path=/; Max-Age=3300; SameSite=Strict${secure}`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Strict`;
}

// JWT의 payload 부분만 디코드 (검증은 서버/미들웨어가 함 — 여기선 화면 표시용으로만 사용)
function decodeIdTokenPayload(idToken) {
  try {
    const payload = idToken.split(".")[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

async function signupUser(email, password, grade) {
  const cred = await auth.createUserWithEmailAndPassword(email, password);
  await db.collection("users").doc(cred.user.uid).set({
    email,
    grade,
    approved: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  await auth.signOut();
}

async function loginUser(email, password) {
  const cred = await auth.signInWithEmailAndPassword(email, password);
  const idToken = await cred.user.getIdToken(true); // 승인 직후 커스텀 클레임 반영을 위해 강제 갱신
  setSessionCookie(idToken);
  return decodeIdTokenPayload(idToken);
}

async function logoutUser() {
  clearSessionCookie();
  await auth.signOut();
  location.href = "/login.html";
}

// 로그인 상태가 유지되는 동안 토큰이 자동 갱신될 때마다 쿠키도 같이 갱신
auth.onIdTokenChanged(async (user) => {
  if (user) {
    const idToken = await user.getIdToken();
    setSessionCookie(idToken);
  }
});
