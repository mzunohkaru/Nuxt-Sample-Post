import { getDataSource } from "../../utils/typeorm";
import { requireAuth } from "../../utils/middleware";
import { Post } from "../../entities/Post";

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

    const dataSource = await getDataSource();
    const postRepository = dataSource.getRepository(Post);

    const newPost = postRepository.create({
      title: body.title,
      content: body.content,
      user_id: user.id,
    });

    const savedPost = await postRepository.save(newPost);

    return {
      success: true,
      data: savedPost,
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
