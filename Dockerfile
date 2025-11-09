# Node.jsの公式イメージを使用
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのコードをコピー
COPY . .

# Next.jsの開発サーバーを起動
CMD ["npm", "run", "dev"]

# ポート3000を公開
EXPOSE 3000
