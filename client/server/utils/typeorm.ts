import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

let dataSource: DataSource | null = null;

export async function getDataSource() {
  if (!dataSource) {
    const config = useRuntimeConfig();
    
    dataSource = new DataSource({
      type: "postgres",
      url: config.databaseUrl,
      entities: [User, Post],
      synchronize: false,
      logging: process.env.NODE_ENV === "development",
    });

    await dataSource.initialize();
    console.log("TypeORM DataSource initialized");
  }
  return dataSource;
}
