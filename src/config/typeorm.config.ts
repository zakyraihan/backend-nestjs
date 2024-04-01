import { TypeOrmModuleOptions } from "@nestjs/typeorm";
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306, // Number(process.env.DB_PORT), //port default 3306 lihat xampp
  username: "root", // process.env.DB_USERNAME, // username default xampp root
  password: "", // password default xampp string kosong
  database: "ptsfullstack",
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true,
  // logging: true
};
