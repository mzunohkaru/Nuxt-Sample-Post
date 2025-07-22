#!/bin/bash

echo "🚀 投稿掲示板アプリケーションの利用者ドキュメントを生成します..."

# Playwrightブラウザのインストール（初回のみ）
if [ ! -d "node_modules/@playwright" ]; then
    echo "📦 Playwrightをインストールしています..."
    npm install
    npx playwright install chromium
fi

# Docker環境が起動しているか確認
if ! docker-compose ps | grep -q "Up"; then
    echo "🐳 Docker環境を起動しています..."
    docker-compose up -d
    echo "⏳ サーバーの起動を待機中..."
    sleep 30
fi

# テストを実行してドキュメントを生成
echo "🧪 テストを実行してドキュメントを生成中..."
npx playwright test tests/user-documentation.spec.ts

echo "✅ 完了！以下のファイルが生成されました："
echo "   📄 docs/user-guide.md - 利用者ドキュメント"
echo "   📸 docs/screenshots/ - スクリーンショット集"
echo ""
echo "📖 ドキュメントを確認するには："
echo "   cat docs/user-guide.md" 