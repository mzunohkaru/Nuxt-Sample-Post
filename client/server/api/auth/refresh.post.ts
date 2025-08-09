import { getCookie } from "h3";
import { verifyRefreshToken, generateAccessToken } from "../../utils/auth";
import { getDataSource } from "../../utils/typeorm";
import { User } from "../../entities/User";

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
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    
    const user = await userRepository.findOne({
      where: { id: payload.userId },
      select: ["id", "username", "email"]
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "ユーザーが見つかりません",
      });
    }

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
