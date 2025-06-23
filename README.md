# Vue Docker Project

Nuxt 3 を使用した Web アプリケーション開発プロジェクトです。
Web サーバーと PostgreSQL データベースを Docker で構築します。

## 構成

```
vue-docker/
├── client/                 # Nuxt 3 アプリケーション
│   ├── app/                # アプリケーション本体
│   │   ├── app.config.ts   # アプリケーション設定
│   │   ├── app.vue         # ルートコンポーネント
│   │   ├── assets/         # アセットファイル
│   │   │   └── css/        # スタイルシート
│   │   └── pages/          # ページコンポーネント
│   ├── server/             # サーバーサイドAPI
│   │   ├── api/            # API エンドポイント
│   │   │   ├── posts/      # 投稿関連API
│   │   │   └── tests/      # テスト関連API
│   │   ├── utils/          # ユーティリティ
│   │   └── tsconfig.json   # TypeScript設定（サーバー用）
│   ├── public/             # 静的ファイル
│   ├── Dockerfile          # Webアプリ用Dockerfile
│   ├── eslint.config.mjs   # ESLint設定
│   ├── nuxt.config.ts      # Nuxt設定
│   ├── package.json        # Node.js依存関係
│   ├── package-lock.json   # 依存関係ロック
│   ├── README.md           # Nuxtアプリ説明
│   └── tsconfig.json       # TypeScript設定
├── db/                     # DB用Docker設定
│   ├── Dockerfile          # DB用Dockerfile
│   └── init/               # DB初期化スクリプト
│       ├── 01-create-tables.sql     # テーブル作成
│       └── 02-insert-sample-data.sql # サンプルデータ
├── scripts/                # 開発用スクリプト
│   └── dev.sh              # 開発環境制御スクリプト
├── docker-compose.yaml     # Docker Compose設定
├── package-lock.json       # 依存関係ロック（ルート）
└── README.md               # このファイル
```

## 必要な環境

- Docker
- Docker Compose

## セットアップ

1. プロジェクトのクローン

```bash
git clone <repository-url>
cd vue-docker
```

2. 環境変数ファイルの作成

```bash
cp .env.example .env
```

3. Docker 環境の起動

```bash
docker-compose up -d
```

4. アプリケーションへのアクセス

- Web: http://localhost:3000
- DB: localhost:5432

## 開発

### 開発サーバーの起動

```bash
docker-compose up
```

または開発用スクリプトを使用：

```bash
./scripts/dev.sh start
```

### ログの確認

```bash
# 全サービス
docker-compose logs -f

# Webアプリのみ
docker-compose logs -f app

# DBのみ
docker-compose logs -f db
```

### コンテナの停止

```bash
docker-compose down
```

または開発用スクリプトを使用：

```bash
./scripts/dev.sh stop
```

### データベースのリセット

```bash
docker-compose down -v
docker-compose up -d
```

または開発用スクリプトを使用：

```bash
./scripts/dev.sh reset
```

## API エンドポイント

- `GET /api/posts` - 投稿一覧取得
- `POST /api/posts` - 投稿作成
- `GET /api/posts/[id]` - 投稿詳細取得
- `PUT /api/posts/[id]` - 投稿更新
- `DELETE /api/posts/[id]` - 投稿削除

## データベース

PostgreSQL 15 を使用。初期テーブルは自動で作成されます。

接続情報:

- Host: localhost
- Port: 5432
- Database: bulletin_board
- User: postgres
- Password: postgres
