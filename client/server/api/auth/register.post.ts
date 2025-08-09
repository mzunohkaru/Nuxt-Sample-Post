import { getDataSource } from "../../utils/typeorm";
import {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/auth";
import { User } from "../../entities/User";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // バリデーション
    if (!body.username || !body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: "ユーザー名、メールアドレス、パスワードは必須です",
      });
    }

    // 基本的なバリデーション
    if (body.username.length < 3 || body.username.length > 50) {
      throw createError({
        statusCode: 400,
        statusMessage: "ユーザー名は3文字以上50文字以下で入力してください",
      });
    }

    // 簡単なメールフォーマットチェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "有効なメールアドレスを入力してください",
      });
    }

    if (body.password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: "パスワードは6文字以上で入力してください",
      });
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    // 既存ユーザーのチェック（ユーザー名とメールアドレス）
    const existingUser = await userRepository.findOne({
      where: [
        { username: body.username },
        { email: body.email }
      ]
    });

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage:
          "そのユーザー名またはメールアドレスは既に使用されています",
      });
    }

    // パスワードのハッシュ化
    const hashedPassword = hashPassword(body.password);

    // ユーザーの作成
    const newUser = userRepository.create({
      username: body.username,
      email: body.email,
      password_hash: hashedPassword,
    });

    const savedUser = await userRepository.save(newUser);

    // 認証トークンの生成
    const accessToken = generateAccessToken(savedUser);
    const refreshToken = generateRefreshToken(savedUser);

    // レスポンスでパスワードハッシュは除外
    return {
      success: true,
      message: "ユーザー登録が完了しました",
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        created_at: savedUser.created_at,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("ユーザー登録エラー:", error);

    // データベースエラーの場合
    if (error instanceof Error && "code" in error && error.code === "23505") {
      // PostgreSQLの一意制約違反
      throw createError({
        statusCode: 409,
        statusMessage:
          "そのユーザー名またはメールアドレスは既に使用されています",
      });
    }

    // 既にcreateErrorで作成されたエラーの場合はそのまま投げる
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }

    // その他のエラー
    throw createError({
      statusCode: 500,
      statusMessage: "ユーザー登録中にエラーが発生しました",
    });
  }
});
