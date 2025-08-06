FROM node:22-alpine

WORKDIR /usr/src/app

# パッケージファイルをコピーして依存関係をインストール
COPY client/package*.json ./
RUN npm install

# アプリケーションファイルをコピー
COPY . .

# Nuxtの準備
RUN npm run postinstall

EXPOSE 3000

CMD ["npm", "run", "dev"]