#!/bin/bash

# 開発環境用スクリプト

case "$1" in
  "start")
    echo "🚀 開発環境を起動しています..."
    docker-compose up
    echo "✅ 開発環境が起動しました"
    echo "🌐 アプリケーション: http://localhost:3000"
    echo "🗄️  データベース: localhost:5432"
    ;;
  "stop")
    echo "⏹️  開発環境を停止しています..."
    docker-compose down
    echo "✅ 開発環境が停止しました"
    ;;
  "restart")
    echo "🔄 開発環境を再起動しています..."
    docker-compose down
    docker-compose up -d
    echo "✅ 開発環境が再起動しました"
    ;;
  "logs")
    echo "📋 ログを表示しています..."
    docker-compose logs -f
    ;;
  "reset")
    echo "🔄 データベースをリセットしています..."
    docker-compose down -v
    docker-compose up -d
    echo "✅ データベースがリセットされました"
    ;;
  "build")
    echo "🔨 イメージを再ビルドしています..."
    docker-compose build --no-cache
    echo "✅ イメージが再ビルドされました"
    ;;
  *)
    echo "使用方法: $0 {start|stop|restart|logs|reset|build}"
    echo ""
    echo "コマンド:"
    echo "  start   - 開発環境を起動"
    echo "  stop    - 開発環境を停止"
    echo "  restart - 開発環境を再起動"
    echo "  logs    - ログを表示"
    echo "  reset   - データベースをリセット"
    echo "  build   - イメージを再ビルド"
    exit 1
    ;;
esac 