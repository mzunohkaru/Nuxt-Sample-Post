FROM postgres:latest

# データベース環境変数の設定
ENV POSTGRES_DB=bulletin_board
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# 初期化スクリプトをコピー
COPY init/ /docker-entrypoint-initdb.d/

EXPOSE 5432