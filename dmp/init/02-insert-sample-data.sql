-- ユーザーサンプルデータの挿入（postsテーブルより先に作成）
-- パスワード: password123 (admin), userpass1 (user1), testpass (testuser)
INSERT INTO users (username, email, password_hash) VALUES 
    ('admin', 'admin@example.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'),
    ('user1', 'user1@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'),
    ('test', 'test@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');

-- サンプルデータの挿入（user_idを含む）
INSERT INTO posts (title, content, user_id) VALUES 
    ('初めての投稿', 'これは最初のサンプル投稿です。Vue.jsとNuxtを使った掲示板アプリケーションのテストデータです。', 1),
    ('Vue.jsについて', 'Vue.jsは進歩的なJavaScriptフレームワークです。ユーザーインターフェイスを構築するために設計されています。', 2),
    ('Dockerの活用', 'Dockerを使用することで、開発環境を簡単に構築し、一貫性のある環境でアプリケーションを実行できます。', 1);
