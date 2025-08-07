import { createHash, randomBytes, timingSafeEqual } from "crypto";

/**
 * パスワードをハッシュ化する
 */
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

/**
 * パスワードを検証する
 */
export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  const verifyHash = createHash("sha256").update(password).digest("hex");

  return timingSafeEqual(
    Buffer.from(hashedPassword, "hex"),
    Buffer.from(verifyHash, "hex")
  );
}

/**
 * 簡単なJWTのような認証トークンを生成する（開発用）
 */
export function generateAuthToken(userId: number): string {
  const payload = JSON.stringify({
    userId,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24時間
  });
  return Buffer.from(payload).toString("base64");
}

/**
 * 認証トークンを検証する
 */
export function verifyAuthToken(
  token: string
): { userId: number; exp: number } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString());
    if (payload.exp < Date.now()) {
      return null; // トークンが期限切れ
    }
    return payload;
  } catch {
    return null;
  }
}
