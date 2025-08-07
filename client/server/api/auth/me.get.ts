import { requireAuth } from "../../utils/middleware";

export default defineEventHandler(async (event) => {
  try {
    // 認証チェック
    const user = await requireAuth(event);

    return {
      success: true,
      data: {
        user,
      },
    };
  } catch (error) {
    console.error("Get current user error:", error);

    // createErrorで作成されたエラーはそのまま投げる
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "サーバーエラーが発生しました",
    });
  }
});
