import { getDB } from "../../utils/db";
import { requireAuth } from "../../utils/middleware";

export default defineEventHandler(async (event) => {
  // 認証チェック
  await requireAuth(event);

  try {
    const db = getDB();

    const result = await db.query(
      "SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC",
    );

    return {
      success: true,
      data: result.rows,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    let errorMessage = "投稿の取得に失敗しました";
    if (error instanceof Error) {
      errorMessage = `データベースエラー: ${error.message}`;
    }

    // requireAuthからのエラーはそのままスロー
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    });
  }
});
