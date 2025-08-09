import { getDB } from "../../utils/db";
import {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // バリデーション
    if (!body.username || !body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: "ユーザー名、メールアドレス、パスワードは必須です",
      });
    }

    // 基本的なバリデーション
    if (body.username.length < 3 || body.username.length > 50) {
      throw createError({
        statusCode: 400,
        statusMessage: "ユーザー名は3文字以上50文字以下で入力してください",
      });
    }

    // 簡単なメールフォーマットチェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "有効なメールアドレスを入力してください",
      });
    }

    if (body.password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: "パスワードは6文字以上で入力してください",
      });
    }

    const db = getDB();

    // 既存ユーザーのチェック（ユーザー名とメールアドレス）
    const existingUserQuery = `
      SELECT id FROM users 
      WHERE username = $1 OR email = $2
    `;
    const existingUser = await db.query(existingUserQuery, [
      body.username,
      body.email,
    ]);

    if (existingUser.rows.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage:
          "そのユーザー名またはメールアドレスは既に使用されています",
      });
    }

    // パスワードのハッシュ化
    const hashedPassword = hashPassword(body.password);

    // ユーザーの作成
    const insertQuery = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;
    const result = await db.query(insertQuery, [
      body.username,
      body.email,
      hashedPassword,
    ]);

    const newUser = result.rows[0];

    // 認証トークンの生成
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // レスポンスでパスワードハッシュは除外
    return {
      success: true,
      message: "ユーザー登録が完了しました",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        created_at: newUser.created_at,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("ユーザー登録エラー:", error);

    // データベースエラーの場合
    if (error instanceof Error && "code" in error && error.code === "23505") {
      // PostgreSQLの一意制約違反
      throw createError({
        statusCode: 409,
        statusMessage:
          "そのユーザー名またはメールアドレスは既に使用されています",
      });
    }

    // 既にcreateErrorで作成されたエラーの場合はそのまま投げる
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }

    // その他のエラー
    throw createError({
      statusCode: 500,
      statusMessage: "ユーザー登録中にエラーが発生しました",
    });
  }
});
