import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

// logs dir
const logDir: string = join(__dirname, "../../logs");

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const consoleLog = new winston.transports.Console({
  level: "debug",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ level, message, metadata, timestamp }) => {
      if (metadata && Object.keys(metadata).length) {
        return `${timestamp} ${level}: ${message} ${JSON.stringify(metadata)}`;
      }
      return `${timestamp}  ${level}: ${message}`;
    })
  ),
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.metadata(),
    // 使用自定义格式化程序将时间戳移动到 JSON 对象的顶级
    winston.format.printf(({ level, message, metadata, timestamp }) => {
      const logObj = { timestamp, level, message, metadata };
      // if (metadata) {
      // 	Object.assign(logObj, metadata);
      // }
      logObj.timestamp = metadata.timestamp;
      delete metadata.timestamp;
      logObj.level = level;
      logObj.message = message;
      logObj.metadata = metadata;
      return JSON.stringify(logObj);
    })
  ),
  transports: [
    // debug文件日志输出
    new winstonDaily({
      level: "debug",
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/debug`, // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: true,
      zippedArchive: true,
    }),
    // error文件日志输出
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/error`, // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});
logger.add(consoleLog);
// if (process.env.NODE_ENV !== "production") {
//   logger.add(consoleLog);
// }
// 添加异常处理逻辑
process.on("uncaughtException", (error) => {
  logger.error(`Caught exception: ${error.message}`, error);
  process.exit(1);
});
// 添加进程退出事件处理逻辑
process.on("exit", (code) => {
  logger.info(`Process exited with code ${code}`);
});
const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};
export { logger, stream };
