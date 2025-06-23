import { Pool } from "pg";

let pool: Pool | null = null;

export function getDB() {
  if (!pool) {
    try {
      const config = useRuntimeConfig();
      console.log("データベース接続URL:", config.databaseUrl);

      pool = new Pool({
        connectionString: config.databaseUrl,
      });

      console.log("PostgreSQL接続プールを初期化しました");
    } catch (error) {
      console.error("データベース接続の初期化に失敗しました:", error);
      throw error;
    }
  }
  return pool;
}
