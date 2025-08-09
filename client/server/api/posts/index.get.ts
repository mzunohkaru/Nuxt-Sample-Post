import { getDataSource } from "../../utils/typeorm";
import { requireAuth } from "../../utils/middleware";
import { Post } from "../../entities/Post";

export default defineEventHandler(async (event) => {
  // 認証チェック
  await requireAuth(event);

  try {
    const dataSource = await getDataSource();
    const postRepository = dataSource.getRepository(Post);
    
    const posts = await postRepository.find({
      relations: ["user"],
      order: { created_at: "DESC" },
      select: {
        user: { username: true }
      }
    });

    return {
      success: true,
      data: posts.map(post => ({
        ...post,
        username: post.user.username
      })),
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
