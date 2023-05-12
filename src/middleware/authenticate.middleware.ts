import * as console from "console";
import * as jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { SECRET_KEY } from "../utils/constant";
import { logger } from "../utils/logger";

// 定义验证JWT Token的中间件函数
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, SECRET_KEY);

      // 添加user属性到req对象中，以便后续路由函数使用
      (req as any).userPhone = decodedToken.userPhone;
      next();
    } catch (e) {
      logger.error(e);
      res.status(200).json(ApiResponse.needLogin());
    }
  } else {
    logger.info("No token provided");
    res.status(200).json(ApiResponse.needLogin());
  }
};
