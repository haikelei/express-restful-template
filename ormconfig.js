const fs = require("fs");

function getCompiledOrSourcePath(directory) {
  const isBuildExists = fs.existsSync(`./build/${directory}`);

  if (isBuildExists) {
    return `build/${directory}/**/*.js`;
  } else {
    return `src/${directory}/**/*.ts`;
  }
}
module.exports = {
  type: "mysql",
  extra: {
    driver: require("mysql2"),
  },
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [getCompiledOrSourcePath("entity")],
  migrations: [getCompiledOrSourcePath("migration")],
  subscribers: [getCompiledOrSourcePath("subscriber")],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
