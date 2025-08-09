import { createHash, timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";
import type { User } from "~/types";

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
  hashedPassword: string,
): boolean {
  const verifyHash = createHash("sha256").update(password).digest("hex");

  return timingSafeEqual(
    Buffer.from(hashedPassword, "hex"),
    Buffer.from(verifyHash, "hex"),
  );
}

// --- JWT-based Authentication ---

// 環境変数からシークレットキーを取得
// 注意: 実際のアプリケーションでは、これらのキーを.envファイルなどで安全に管理する必要があります。
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret-for-dev";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret-for-dev";

interface JwtPayload {
  userId: number;
}

/**
 * アクセストークンを生成する
 * @param user - ユーザーオブジェクト
 * @returns アクセストークン
 */
export function generateAccessToken(user: Pick<User, "id">): string {
  const payload: JwtPayload = { userId: user.id };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

/**
 * リフレッシュトークンを生成する
 * @param user - ユーザーオブジェクト
 * @returns リフレッシュトークン
 */
export function generateRefreshToken(user: Pick<User, "id">): string {
  const payload: JwtPayload = { userId: user.id };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

/**
 * アクセストークンを検証する
 * @param token - アクセストークン
 * @returns 検証されたペイロード、またはnull
 */
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * リフレッシュトークンを検証する
 * @param token - リフレッシュトークン
 * @returns 検証されたペイロード、またはnull
 */
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}
