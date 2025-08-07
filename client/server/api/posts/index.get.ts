import { getDB } from "../../utils/db";

export default defineEventHandler(async () => {
  try {
    const db = getDB();

    // データベース接続をテスト
    await db.query("SELECT 1");

    const result = await db.query(
      "SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC",
    );

    return {
      success: true,
      data: result.rows,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    // より詳細なエラー情報を提供
    let errorMessage = "Failed to fetch posts";
    if (error instanceof Error) {
      errorMessage = `Database error: ${error.message}`;
    }

    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    });
  }
});
