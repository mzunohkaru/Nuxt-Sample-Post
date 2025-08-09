import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

let dataSource: DataSource | null = null;

export async function getDataSource() {
  if (!dataSource) {
    const databaseUrl =
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/bulletin_board";

    dataSource = new DataSource({
      type: "postgres",
      url: databaseUrl,
      entities: [User, Post],
      synchronize: false,
      logging: process.env.NODE_ENV === "development",
    });

    await dataSource.initialize();
    console.log("TypeORM DataSource initialized");
  }
  return dataSource;
}
