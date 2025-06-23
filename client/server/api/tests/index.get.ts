export default defineEventHandler(async (event) => {
  try {
    // モックデータを作成
    const mockData = [
      {
        id: 1,
        title: "テスト投稿1",
        content: "これはテスト用の投稿内容です。",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        title: "テスト投稿2",
        content: "2番目のテスト投稿です。",
        created_at: "2024-01-14T15:45:00Z",
        updated_at: "2024-01-14T15:45:00Z",
      },
      {
        id: 3,
        title: "テスト投稿3",
        content: "3番目のテスト投稿の内容です。",
        created_at: "2024-01-13T09:20:00Z",
        updated_at: "2024-01-13T09:20:00Z",
      },
    ];

    return {
      success: true,
      data: mockData,
    };
  } catch (error) {
    console.error("Error in mock API:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch test data",
    });
  }
});
