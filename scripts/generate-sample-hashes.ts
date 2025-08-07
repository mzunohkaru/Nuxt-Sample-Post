// このファイルは一時的にサンプルハッシュを生成するためのものです
import { hashPassword } from "../client/server/utils/auth";

console.log("admin (password: password123):", hashPassword("password123"));
console.log("user1 (password: userpass1):", hashPassword("userpass1"));
console.log("testuser (password: testpass):", hashPassword("testpass"));
