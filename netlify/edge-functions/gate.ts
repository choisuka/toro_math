// 서버단 접근 게이트. 모든 요청(로그인/회원가입/대기 페이지 제외)에 대해
// 쿠키의 Firebase ID 토큰을 검증하고, 승인된 사용자가 아니면 콘텐츠를 내려주지 않고 리다이렉트한다.
import type { Config, Context } from "@netlify/edge-functions";
import { createRemoteJWKSet, jwtVerify } from "https://esm.sh/jose@5";

const PROJECT_ID = Netlify.env.get("FIREBASE_PROJECT_ID") ?? "";
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const token = readCookie(request, "td_session");

  if (!token) {
    return Response.redirect(
      new URL(`/login.html?redirect=${encodeURIComponent(url.pathname)}`, url.origin),
      302
    );
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${PROJECT_ID}`,
      audience: PROJECT_ID,
    });

    if (payload.approved !== true) {
      return Response.redirect(new URL("/pending.html", url.origin), 302);
    }

    return context.next();
  } catch {
    return Response.redirect(
      new URL(`/login.html?redirect=${encodeURIComponent(url.pathname)}`, url.origin),
      302
    );
  }
};

export const config: Config = {
  path: "/*",
  excludedPath: [
    "/login.html",
    "/signup.html",
    "/pending.html",
    "/admin.html",
    "/firebase-config.js",
    "/auth-common.js",
    "/.netlify/*",
    "/favicon.ico",
  ],
};
