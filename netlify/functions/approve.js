// 관리자 승인 처리. admin.html에서만 호출됨.
// 필요한 Netlify 환경변수:
//   FIREBASE_SERVICE_ACCOUNT_JSON — Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성으로 받은 JSON 전체를 문자열로
//   ADMIN_EMAIL — 승인 권한을 가진 계정 이메일 (firebase-config.js의 ADMIN_EMAIL과 동일하게)
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    ),
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { idToken, targetUid, grade, action } = body;
  if (!idToken || !targetUid || !["approve", "reject"].includes(action)) {
    return { statusCode: 400, body: "Missing required fields" };
  }

  let caller;
  try {
    caller = await admin.auth().verifyIdToken(idToken);
  } catch {
    return { statusCode: 401, body: "Invalid token" };
  }

  if (caller.email !== process.env.ADMIN_EMAIL) {
    return { statusCode: 403, body: "Forbidden" };
  }

  const db = admin.firestore();

  if (action === "reject") {
    await db.collection("users").doc(targetUid).delete();
    await admin.auth().deleteUser(targetUid).catch(() => {});
    return { statusCode: 200, body: JSON.stringify({ ok: true, action: "reject" }) };
  }

  if (!grade) {
    return { statusCode: 400, body: "grade is required to approve" };
  }

  await admin.auth().setCustomUserClaims(targetUid, { approved: true, grade });
  await db.collection("users").doc(targetUid).update({
    approved: true,
    grade,
    approvedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { statusCode: 200, body: JSON.stringify({ ok: true, action: "approve" }) };
};
