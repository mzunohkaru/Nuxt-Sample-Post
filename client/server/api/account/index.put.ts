import { getDB } from "../../utils/db";
import { requireAuth } from "../../utils/middleware";
import type { H3Event } from "h3";

// ユーザー情報の型定義
interface User {
  id: number;
  username: string;
  email: string;
}

// Zod や Valibot のようなバリデーションライブラリがないため、手動でバリデーション
function validateBody(body: any) {
  if (!body || typeof body !== "object") {
    return "リクエストボディが必要です";
  }
  if (!body.username || typeof body.username !== "string" || body.username.trim() === "") {
    return "ユーザー名は必須です";
  }
  if (!body.email || typeof body.email !== "string" || !/^\S+@\S+\.\S+$/.test(body.email)) {
    return "有効なメールアドレスを入力してください";
  }
  return null;
}

export default defineEventHandler(async (event: H3Event) => {
  // 1. 認証チェックとユーザー情報の取得
  const user = await requireAuth(event);

  // 2. リクエストボディの読み込みとバリデーション
  const body = await readBody(event);
  const validationError = validateBody(body);
  if (validationError) {
    throw createError({
      statusCode: 400,
      statusMessage: validationError,
    });
  }

  const { username, email } = body;

  try {
    const db = getDB();

    // 3. データベースを更新
    const result = await db.query(
      `UPDATE users
       SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, username, email`,
      [username, email, user.id]
    );

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "ユーザーが見つかりませんでした",
      });
    }

    // 4. 更新されたユーザー情報を返す
    return {
      success: true,
      user: result.rows[0] as User,
    };

  } catch (error: any) {
    // 5. エラーハンドリング (特に一意性制約違反)
    if (error.code === '23505') { // PostgreSQLのunique_violationエラーコード
      const detail = error.detail || '';
      if (detail.includes('users_username_key')) {
        throw createError({
          statusCode: 409, // Conflict
          statusMessage: "このユーザー名は既に使用されています",
        });
      }
      if (detail.includes('users_email_key')) {
        throw createError({
          statusCode: 409, // Conflict
          statusMessage: "このメールアドレスは既に使用されています",
        });
      }
    }

    console.error("Error updating user:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "ユーザー情報の更新中にエラーが発生しました",
    });
  }
});
