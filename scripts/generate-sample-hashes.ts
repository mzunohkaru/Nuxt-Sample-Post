// このファイルは一時的にサンプルハッシュを生成するためのものです
import { hashPassword } from "../client/server/utils/auth";

console.log("admin (password: admin):", hashPassword("admin"));
console.log("user1 (password: password):", hashPassword("password"));
console.log("test (password: password):", hashPassword("password"));
