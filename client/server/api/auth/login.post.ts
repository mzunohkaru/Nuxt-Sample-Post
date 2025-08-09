import { getDataSource } from "../../utils/typeorm";
import {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/auth";
import { setCookie } from "h3";
import { User } from "../../entities/User";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // バリデーション
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: "ユーザー名とパスワードが必要です",
      });
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    // ユーザーを検索
    const user = await userRepository.findOne({
      where: [
        { username: body.username },
        { email: body.username }
      ],
      select: ["id", "username", "email", "password_hash"]
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "ユーザー名またはパスワードが間違っています",
      });
    }

    // パスワードを検証
    if (!verifyPassword(body.password, user.password_hash)) {
      throw createError({
        statusCode: 401,
        statusMessage: "ユーザー名またはパスワードが間違っています",
      });
    }

    // アクセストークンとリフレッシュトークンを生成
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // リフレッシュトークンをHTTPOnlyクッキーに設定
    setCookie(event, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 本番環境ではtrue
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7日間
    });

    // ログイン成功時のレスポンス
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        accessToken,
      },
      message: "ログインに成功しました",
    };
  } catch (error) {
    console.error("Login error:", error);

    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "サーバーエラーが発生しました",
    });
  }
});
