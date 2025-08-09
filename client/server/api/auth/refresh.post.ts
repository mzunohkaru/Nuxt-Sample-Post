import { getCookie } from "h3";
import { verifyRefreshToken, generateAccessToken } from "../../utils/auth";
import { getDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  try {
    // 1. クッキーからリフレッシュトークンを取得
    const refreshToken = getCookie(event, "refreshToken");
    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "リフレッシュトークンが見つかりません",
      });
    }

    // 2. リフレッシュトークンを検証
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw createError({
        statusCode: 401,
        statusMessage: "無効なリフレッシュトークンです",
      });
    }

    // 3. ユーザーがまだ存在するかデータベースで確認
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

    // 4. 新しいアクセストークンを生成
    const newAccessToken = generateAccessToken(user);

    // 5. 新しいアクセストークンを返す
    return {
      success: true,
      accessToken: newAccessToken,
    };
  } catch (error) {
    console.error("Refresh token error:", error);

    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "サーバーエラーが発生しました",
    });
  }
});
