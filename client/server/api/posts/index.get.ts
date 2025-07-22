import { getDB } from "../../utils/db";

export default defineEventHandler(async (event) => {
  try {
    const db = getDB();
    console.log("データベース接続を試行中...");

    // データベース接続をテスト
    await db.query("SELECT 1");
    console.log("データベース接続成功");

    const result = await db.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );

    console.log(`投稿を${result.rows.length}件取得しました`);

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
