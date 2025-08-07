import { verifyAuthToken } from "./auth";
import { getDB } from "./db";

/**
 * 認証が必要なAPIのミドルウェア
 */
export async function requireAuth(event: any) {
  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "認証トークンが必要です",
    });
  }

  const token = authHeader.substring(7); // "Bearer " を除去
  const payload = verifyAuthToken(token);

  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: "無効な認証トークンです",
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

  // イベントにユーザー情報を追加
  event.context.user = userResult.rows[0];
  return userResult.rows[0];
}
