import express from "express";
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  register,
} from "prom-client";
import type { Routes } from "./interfaces/routes.interface";
import { logger } from "./utils/logger";

class App {
  public app: express.Application;
  private requestDurationHistogram: Histogram<string>;
  private requestCounter: Counter<string>; // 添加请求计数器

  constructor(routes: Routes[]) {
    this.app = express();
    this.globalConfig();
    this.initializeMiddlewares();
    this.initializePrometheus();
    this.initializeRoutes(routes);
    this.initFileDir();
    // prometheus
    collectDefaultMetrics();
  }

  private initializePrometheus() {
    this.app.get("/metrics", async (req, res) => {
      try {
        const metrics = await register.metrics();
        res.set("Content-Type", register.contentType);
        res.send(metrics);
      } catch (ex) {
        logger.error(ex);
        res.status(500).send(ex);
      }
    });

    // 定义请求持续时间的Histogram指标
    this.requestDurationHistogram = new Histogram({
      name: "http_request_duration_seconds",
      help: "Duration of HTTP requests in seconds",
      labelNames: ["method", "path", "status"],
      buckets: [1, 3, 5, 10, 15, 20, 25, 30],
    });

    // 定义请求计数器
    this.requestCounter = new Counter({
      name: "http_requests_total",
      help: "Total number of HTTP requests",
      labelNames: ["method", "path", "status"],
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeMiddlewares() {
    const tarsFileFolder = process.env.FILE_DIR;
    if (tarsFileFolder) {
      this.app.use(express.static(tarsFileFolder));
    }
    this.app.use(express.static("public"));
    this.app.use(express.json());
    this.app.use(this.prometheusMiddleware.bind(this)); // 添加Prometheus中间件
  }

  // 添加一个中间件，用于记录请求持续时间和请求次数
  private prometheusMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const startTime = Date.now();

    res.on("finish", () => {
      const duration = (Date.now() - startTime) / 1000;
      const labels = {
        method: req.method,
        path: req.path,
        status: res.statusCode.toString(),
      };

      this.requestDurationHistogram.labels(labels).observe(duration);
      this.requestCounter.labels(labels).inc(); // 递增请求计数器
    });

    next();
  }

  private globalConfig() {
    this.app.all("*", (_, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Methods", "*");
      next();
    });
  }

  public listen() {
    this.app.listen(4095, () => {
      logger.info(`=================================`);
      logger.info(`🚀 App listening on the port 4095`);
      logger.info(`=================================`);
    });
  }

  /**
   * 1. 判断process.env.FILE_DIR是否存在并创建
   * 2. 判断子目录post_images文件夹是否存在并创建
   * @private
   */
  private initFileDir() {
    const tarsFileFolder = process.env.FILE_DIR;
    if (tarsFileFolder) {
      const fs = require("fs");
      const path = require("path");
      if (!fs.existsSync(tarsFileFolder)) {
        fs.mkdirSync(tarsFileFolder);
      }
      const postImagesFolder = path.join(tarsFileFolder, "post_images");
      if (!fs.existsSync(postImagesFolder)) {
        fs.mkdirSync(postImagesFolder);
      }
    }
  }
}

export default App;
