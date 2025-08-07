import { getDB } from "../../utils/db";
import { verifyPassword, generateAuthToken } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // バリデーション
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: "ユーザー名とパスワードが必要です",
      });
    }

    const db = getDB();

    // ユーザーを検索
    const userResult = await db.query(
      "SELECT id, username, email, password_hash FROM users WHERE username = $1 OR email = $1",
      [body.username],
    );

    if (userResult.rows.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: "ユーザー名またはパスワードが間違っています",
      });
    }

    const user = userResult.rows[0];

    // パスワードを検証
    if (!verifyPassword(body.password, user.password_hash)) {
      throw createError({
        statusCode: 401,
        statusMessage: "ユーザー名またはパスワードが間違っています",
      });
    }

    // 認証トークンを生成
    const token = generateAuthToken(user.id);

    // ログイン成功時のレスポンス
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      },
      message: "ログインに成功しました",
    };
  } catch (error) {
    console.error("Login error:", error);

    // createErrorで作成されたエラーはそのまま投げる
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // その他のエラー
    throw createError({
      statusCode: 500,
      statusMessage: "サーバーエラーが発生しました",
    });
  }
});
