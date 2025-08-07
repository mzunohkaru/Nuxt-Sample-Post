-- サンプルデータの挿入
INSERT INTO posts (title, content) VALUES 
    ('初めての投稿', 'これは最初のサンプル投稿です。Vue.jsとNuxtを使った掲示板アプリケーションのテストデータです。'),
    ('Vue.jsについて', 'Vue.jsは進歩的なJavaScriptフレームワークです。ユーザーインターフェイスを構築するために設計されています。'),
    ('Dockerの活用', 'Dockerを使用することで、開発環境を簡単に構築し、一貫性のある環境でアプリケーションを実行できます。');

-- ユーザーサンプルデータの挿入
-- パスワード: password123 (admin), userpass1 (user1), testpass (testuser)
INSERT INTO users (username, email, password_hash) VALUES 
    ('admin', 'admin@example.com', 'f8e9a0b1c2d3e4f5:8a7b6c5d4e3f2a1b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d'),
    ('user1', 'user1@example.com', 'a1b2c3d4e5f6a7b8:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5'),
    ('testuser', 'test@example.com', '9f8e7d6c5b4a3f2e:9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4'); 