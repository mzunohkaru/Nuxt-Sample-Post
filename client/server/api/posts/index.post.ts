import { getDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
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

    // データベース接続をテスト
    await db.query("SELECT 1");

    // 新しい投稿を挿入
    const result = await db.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [body.title, body.content, body.user_id || 1],
    );

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error creating post:", error);

    // より詳細なエラー情報を提供
    let errorMessage = "Failed to create post";
    if (error instanceof Error) {
      errorMessage = `Database error: ${error.message}`;
    }

    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    });
  }
});
