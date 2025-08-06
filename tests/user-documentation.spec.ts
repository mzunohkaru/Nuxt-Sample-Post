import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

let documentationContent = `# 投稿掲示板アプリケーション 利用者ドキュメント

## 概要
このアプリケーションは、Nuxt 3とPostgreSQLを使用した投稿掲示板です。
ユーザーは投稿の作成、閲覧ができます。

## アクセス方法
アプリケーションURL: http://localhost:3000

## 利用可能な機能

`;

test.describe("投稿掲示板アプリケーション - ユーザー機能テスト", () => {
  test("1. ホームページへのアクセス", async ({ page }) => {
    await page.goto("/");

    // ページタイトルの確認
    await expect(page).toHaveTitle(/Nuxt/);

    // メインヘッダーの確認
    const header = page.locator("h1").first();
    await expect(header).toContainText("Posts");

    // スクリーンショットを撮影
    await page.screenshot({
      path: "docs/screenshots/01-homepage.png",
      fullPage: true,
    });

    documentationContent += `### 1. ホームページ
- **URL**: http://localhost:3000/
- **説明**: アプリケーションのメインページです
- **表示内容**: 
  - ページタイトル「Posts」
  - 投稿作成フォーム
  - 既存投稿の一覧表示

![ホームページ](screenshots/01-homepage.png)

`;
  });

  test("2. 投稿フォームの要素確認", async ({ page }) => {
    await page.goto("/");

    // 投稿フォームの確認
    const formTitle = page.locator("h2", { hasText: "新しい投稿を作成" });
    await expect(formTitle).toBeVisible();

    // タイトル入力フィールド
    const titleInput = page.locator("#title");
    await expect(titleInput).toBeVisible();
    await expect(titleInput).toHaveAttribute(
      "placeholder",
      "投稿のタイトルを入力してください"
    );

    // 内容入力フィールド
    const contentTextarea = page.locator("#content");
    await expect(contentTextarea).toBeVisible();
    await expect(contentTextarea).toHaveAttribute(
      "placeholder",
      "投稿の内容を入力してください"
    );

    // 投稿ボタン
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("投稿する");

    // フォーム部分のスクリーンショット
    await page.locator(".mb-6.p-4.border.rounded.bg-gray-50").screenshot({
      path: "docs/screenshots/02-post-form.png",
    });

    documentationContent += `### 2. 投稿作成フォーム
- **場所**: ページ上部
- **構成要素**:
  - **タイトル入力欄**: 投稿のタイトルを入力
  - **内容入力欄**: 投稿の本文を入力（複数行対応）
  - **投稿ボタン**: フォーム送信用

![投稿フォーム](screenshots/02-post-form.png)

`;
  });

  test("3. 投稿作成機能のテスト", async ({ page }) => {
    await page.goto("/");

    // 新しい投稿を作成
    const testTitle = `テスト投稿 ${Date.now()}`;
    const testContent =
      "これはPlaywrightによる自動テストで作成された投稿です。";

    // フォームに入力
    await page.fill("#title", testTitle);
    await page.fill("#content", testContent);

    // 入力後のフォームのスクリーンショット
    await page.screenshot({
      path: "docs/screenshots/03-form-filled.png",
      fullPage: true,
    });

    // 投稿ボタンをクリック
    await page.click('button[type="submit"]');

    // アラートの確認（投稿成功メッセージ）
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("投稿が正常に作成されました");
      await dialog.accept();
    });

    // フォームがクリアされることを確認
    await expect(page.locator("#title")).toHaveValue("");
    await expect(page.locator("#content")).toHaveValue("");

    // 作成後のページのスクリーンショット
    await page.screenshot({
      path: "docs/screenshots/04-post-created.png",
      fullPage: true,
    });

    documentationContent += `### 3. 投稿作成の手順
1. **タイトル入力**: 投稿のタイトルを入力欄に記入
2. **内容入力**: 投稿の内容を本文欄に記入
3. **投稿実行**: 「投稿する」ボタンをクリック
4. **完了確認**: 成功メッセージが表示され、フォームがクリアされます

![フォーム入力完了](screenshots/03-form-filled.png)

![投稿作成完了](screenshots/04-post-created.png)

`;
  });

  test("4. 投稿一覧の表示確認", async ({ page }) => {
    await page.goto("/");

    // 投稿一覧の確認
    const posts = page.locator("li").filter({ hasText: "Title:" });

    // 少なくとも1つの投稿があることを確認
    await expect(posts.first()).toBeVisible();

    // 投稿の構造を確認
    const firstPost = posts.first();
    await expect(firstPost).toContainText("Title:");
    await expect(firstPost).toContainText("Content:");
    await expect(firstPost).toContainText("Time:");

    // 投稿一覧のスクリーンショット
    await page.locator("div").filter({ hasText: "Title:" }).first().screenshot({
      path: "docs/screenshots/05-posts-list.png",
    });

    documentationContent += `### 4. 投稿一覧
- **表示内容**: 作成された投稿が新しい順に表示されます
- **投稿情報**: 
  - **Title**: 投稿のタイトル
  - **Content**: 投稿の内容
  - **Time**: 投稿日時

![投稿一覧](screenshots/05-posts-list.png)

`;
  });

  test("5. Helloページの確認", async ({ page }) => {
    await page.goto("/hello");

    // Helloページの確認
    const header = page.locator("h1");
    await expect(header).toContainText("Hello World");

    // Helloページのスクリーンショット
    await page.screenshot({
      path: "docs/screenshots/06-hello-page.png",
      fullPage: true,
    });

    documentationContent += `### 5. Helloページ
- **URL**: http://localhost:3000/hello
- **説明**: シンプルな挨拶ページです
- **表示内容**: "Hello World"メッセージ

![Helloページ](screenshots/06-hello-page.png)

`;
  });

  test("6. レスポンシブデザインの確認", async ({ page }) => {
    await page.goto("/");

    // モバイルサイズでの表示確認
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: "docs/screenshots/07-mobile-view.png",
      fullPage: true,
    });

    // タブレットサイズでの表示確認
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: "docs/screenshots/08-tablet-view.png",
      fullPage: true,
    });

    // デスクトップサイズに戻す
    await page.setViewportSize({ width: 1280, height: 720 });

    documentationContent += `### 6. レスポンシブ対応
アプリケーションは様々な画面サイズに対応しています：

- **モバイル表示**:
![モバイル表示](screenshots/07-mobile-view.png)

- **タブレット表示**:
![タブレット表示](screenshots/08-tablet-view.png)

`;
  });

  test("7. エラーハンドリングの確認", async ({ page }) => {
    await page.goto("/");

    // 空のフォームで投稿しようとした場合
    await page.click('button[type="submit"]');

    // HTML5のバリデーションにより、必須フィールドのエラーが表示される
    const titleInput = page.locator("#title");
    await expect(titleInput).toHaveAttribute("required");

    const contentInput = page.locator("#content");
    await expect(contentInput).toHaveAttribute("required");

    documentationContent += `### 7. バリデーション
- **必須項目**: タイトルと内容は必須入力です
- **エラー処理**: 
  - 空のフォーム送信時はHTML5バリデーションが働きます
  - サーバーエラー時は適切なエラーメッセージが表示されます

`;
  });

  test.afterAll(async () => {
    // ドキュメントの最終部分を追加
    documentationContent += `
## 技術仕様
- **フロントエンド**: Nuxt 3, Vue.js, Tailwind CSS
- **バックエンド**: Nuxt Server API
- **データベース**: PostgreSQL
- **インフラ**: Docker, Docker Compose

## 開発環境の起動方法
\`\`\`bash
# Docker環境を起動
docker-compose up -d

# または開発スクリプトを使用
./scripts/dev.sh start
\`\`\`

## API エンドポイント
- \`GET /api/posts\` - 投稿一覧取得
- \`POST /api/posts\` - 新規投稿作成

## トラブルシューティング
1. **投稿が表示されない場合**:
   - データベース接続を確認してください
   - \`docker-compose logs db\`でデータベースのログを確認

2. **投稿作成に失敗する場合**:
   - タイトルと内容が入力されているか確認
   - ネットワーク接続を確認

## サポート
問題が発生した場合は、開発チームにお問い合わせください。

---
*このドキュメントは${new Date().toLocaleDateString(
      "ja-JP"
    )}に自動生成されました。*
`;

    // ドキュメントフォルダが存在しない場合は作成
    const docsDir = path.join(process.cwd(), "docs");
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // screenshotsフォルダが存在しない場合は作成
    const screenshotsDir = path.join(docsDir, "screenshots");
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // ドキュメントファイルを保存
    fs.writeFileSync(path.join(docsDir, "user-guide.md"), documentationContent);

    console.log("✅ 利用者ドキュメントが生成されました: docs/user-guide.md");
    console.log("📸 スクリーンショットが保存されました: docs/screenshots/");
  });
});
