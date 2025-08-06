# 開発環境用コマンド

.PHONY: start stop restart logs reset build exec help

# 開発環境を起動
start:
	@echo "🚀 開発環境を起動しています..."
	@docker-compose up
	@echo "✅ 開発環境が起動しました"
	@echo "🌐 アプリケーション: http://localhost:3000"
	@echo "🗄️  データベース: localhost:5432"

# 開発環境を停止
stop:
	@echo "⏹️  開発環境を停止しています..."
	@docker-compose down
	@echo "✅ 開発環境が停止しました"

# 開発環境を再起動
restart:
	@echo "🔄 開発環境を再起動しています..."
	@docker-compose down
	@docker-compose up -d
	@echo "✅ 開発環境が再起動しました"

# ログを表示
logs:
	@echo "📋 ログを表示しています..."
	@docker-compose logs -f

# データベースをリセット
reset:
	@echo "🔄 データベースをリセットしています..."
	@docker-compose down -v
	@docker-compose up -d
	@echo "✅ データベースがリセットされました"

# イメージを再ビルド
build:
	@echo "🔨 イメージを再ビルドしています..."
	@docker-compose build --no-cache
	@echo "✅ イメージが再ビルドされました"

# コンテナに接続
exec:
	@echo "🔌 クライアントコンテナに接続しています..."
	@docker-compose exec nuxt3-client-container "cd /var/www/html"

# ヘルプを表示
help:
	@echo "使用可能なコマンド:"
	@echo ""
	@echo "  make start   - 開発環境を起動"
	@echo "  make stop    - 開発環境を停止"
	@echo "  make restart - 開発環境を再起動"
	@echo "  make logs    - ログを表示"
	@echo "  make reset   - データベースをリセット"
	@echo "  make build   - イメージを再ビルド"
	@echo "  make exec    - クライアントコンテナに接続"
	@echo "  make help    - このヘルプを表示"
