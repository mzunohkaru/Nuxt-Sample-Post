import { deleteCookie } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // リフレッシュトークンクッキーを削除
    deleteCookie(event, "refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return {
      success: true,
      message: "ログアウトしました",
    };
  } catch (error) {
    console.error("Logout error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "ログアウト中にエラーが発生しました",
    });
  }
});
