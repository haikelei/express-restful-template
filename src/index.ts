import { createConnection } from "typeorm";
import dotenv from "dotenv";
import IndexRoute from "./routes/index.route";
import App from "./App";
import { UserRoute } from "./routes/user.route";
import { logger } from "./utils/logger";
// 注意,环境变量使用的是.env文件,docker打包时会根据不同参数打包不同的.env.xxx文件拷贝到项目中.env文件
dotenv.config({ path: process.env.ENV_PATH });
logger.info(process.env.DB_HOST);
createConnection()
  .then(() => {
    logger.debug("Database connected");
    const app = new App([new IndexRoute(), new UserRoute()]);
    app.listen();
  })
  .catch((error) => {
    logger.error("Database connection error:", error);
  });
