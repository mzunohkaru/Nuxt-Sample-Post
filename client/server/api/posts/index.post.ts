import { getDB } from "../../utils/db";
import { requireAuth } from "../../utils/middleware";

export default defineEventHandler(async (event) => {
  // 認証チェックとユーザー情報の取得
  const user = await requireAuth(event);

  try {
    const body = await readBody(event);

    // リクエストボディの検証
    if (!body.title || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: "タイトルと内容は必須です",
      });
    }

    const db = getDB();

    // 新しい投稿を挿入（認証されたユーザーIDを使用）
    const result = await db.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [body.title, body.content, user.id], // <-- Use authenticated user's ID
    );

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error creating post:", error);

    // requireAuthからのエラーはそのままスロー
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    let errorMessage = "投稿の作成に失敗しました";
    if (error instanceof Error) {
      errorMessage = `データベースエラー: ${error.message}`;
    }

    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    });
  }
});
