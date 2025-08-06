# Nuxt-Sample-Post

Nuxt 3 を使用した投稿サンプルアプリケーションです。
Web サーバーと PostgreSQL データベースを Docker で構築します。

## 構成

```
Nuxt-Sample-Post/
├── client/                 # Nuxt 3 アプリケーション
│   ├── app/                # アプリケーション本体
│   │   ├── pages/          # ページコンポーネント
│   │   ├── server/         # サーバーサイドAPI
│   │   │   ├── api/        # API エンドポイント
│   │   │   └── utils/      # ユーティリティ
│   │   ├── app.vue         # ルートコンポーネント
│   │   └── nuxt.config.ts  # Nuxt設定
│   ├── package.json        # Node.js依存関係
│   └── Dockerfile          # Webアプリ用Dockerfile
├── dmp/                    # DB用Docker設定
│   ├── Dockerfile          # DB用Dockerfile
│   └── init/               # DB初期化スクリプト
│       ├── 01-create-tables.sql
│       └── 02-insert-sample-data.sql
├── docker-compose.yaml     # Docker Compose設定
├── Makefile               # 開発用コマンド
└── README.md              # このファイル
```

この更新された README ファイルは以下の改善点を含んでいます：

- 実際のプロジェクト構造に合わせた構成図
- 環境変数ファイルの具体的な設定例
- Makefile コマンドを活用した効率的な開発フロー
- トラブルシューティング情報
- より実用的な開発手順

これで開発者が迷うことなくプロジェクトをセットアップし、開発を開始できるようになります。

## 必要な環境

- Docker
- Docker Compose
- Make（オプション：便利なコマンド実行のため）

## セットアップ

### 1. プロジェクトのクローン

```bash
git clone <repository-url>
cd Nuxt-Sample-Post
```

### 2. 環境変数ファイルの作成

環境変数ファイル（`.env`）を作成し、データベース接続情報を設定してください：

```bash
cp .env.example .env
```

### 3. 開発環境の起動

**Makefile を使用する場合（推奨）：**

```bash
# 開発環境を起動
make setup
```

**直接 Docker Compose を使用する場合：**

```bash
# Docker環境を起動
docker-compose up
```

### 4. アプリケーションへのアクセス

起動完了後、以下の URL でアクセスできます：

- **Web アプリケーション**: http://localhost:3000
- **データベース**: localhost:5432

## 開発コマンド

このプロジェクトでは便利な Makefile コマンドを提供しています：

### 基本操作

```bash
# 開発環境を起動
make setup

# 開発環境を停止
make stop

# 開発環境を再起動
make restart

# ヘルプを表示
make help
```

### ログとデバッグ

```bash
# ログを表示（リアルタイム）
make logs

# コンテナに接続
make exec
```

### データベース操作

```bash
# データベースをリセット（全データ削除）
make reset

# イメージを再ビルド
make build
```

## API エンドポイント

本アプリケーションでは以下の API エンドポイントが利用可能です：

- `GET /api/posts` - 投稿一覧取得
- `POST /api/posts` - 投稿作成
- `GET /api/tests` - テスト用エンドポイント

## データベース

**使用データベース**: PostgreSQL 15

**接続情報**:

- Host: localhost
- Port: 5432
- Database: bulletin_board
- User: postgres
- Password: postgres

**初期データ**:
コンテナ起動時に `dmp/init/` 内の SQL ファイルが自動実行され、テーブル作成とサンプルデータの投入が行われます。

## トラブルシューティング

### ポートが使用中の場合

```bash
# 既存のコンテナを停止
make stop

# または強制的に停止
docker-compose down -v
```

### データベースの問題

```bash
# データベースを完全にリセット
make reset
```

### イメージの問題

```bash
# イメージを再ビルド
make build
```

## 開発フロー

1. **開発開始**: `make setup`
2. **コード変更**: ファイル編集（ホットリロード対応）
3. **ログ確認**: `make logs`
4. **デバッグ**: `make exec` でコンテナ内に接続
5. **終了**: `make stop`
