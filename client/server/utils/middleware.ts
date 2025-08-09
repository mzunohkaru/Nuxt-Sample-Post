import { verifyAccessToken } from "./auth"; // <-- Changed to verifyAccessToken
import { getDB } from "./db";
import type { H3Event } from "h3";

/**
 * 認証が必要なAPIのミドルウェア
 */
export async function requireAuth(event: H3Event) {
  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "認証トークンが必要です",
    });
  }

  const token = authHeader.substring(7); // "Bearer " を除去
  const payload = verifyAccessToken(token); // <-- Changed to verifyAccessToken

  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: "無効または期限切れの認証トークンです", // <-- Message updated
    });
  }

  // ユーザーが存在するかチェック
  const db = getDB();
  const userResult = await db.query(
    "SELECT id, username, email FROM users WHERE id = $1",
    [payload.userId],
  );

  if (userResult.rows.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: "ユーザーが見つかりません",
    });
  }

  const user = userResult.rows[0];

  // イベントコンテキストにユーザー情報を保存
  event.context.user = user;

  return user;
}
