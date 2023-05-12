import type { NextFunction, Request, Response } from "express";
import type { UserEntity } from "../entity/UserEntity";
import { UserService } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";
export class UserController {
  public userService = new UserService();

  sendVerificationCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { phone } = req.body;
    try {
      // 校验用户输入的手机号格式
      if (!phone || !/^1[3456789]\d{9}$/.test(phone)) {
        res.status(200).json(ApiResponse.error("手机号格式不正确"));
        return;
      }
      await this.userService.sendVerificationCode(phone);
      res.status(200).json(ApiResponse.successWithoutData());
    } catch (error) {
      res.status(200).json(ApiResponse.error(error.message));
    }
  };

  public checkLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(200).json(ApiResponse.successWithoutData());
  };

  /**
   * 用户登录
   * @param req
   * @param res
   * @param next
   */
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone, verificationCode } = req.body;
      const user = await this.userService.loginUser(phone, verificationCode);
      res.status(200).json(ApiResponse.success(user));
    } catch (error) {
      res.status(200).json(ApiResponse.error(error.message));
    }
  };

  /**
   * 获取用户信息
   * @param req
   * @param res
   * @param next
   */
  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.getUserById(userId);
      res.status(200).json(ApiResponse.success(user));
    } catch (error) {
      res.status(200).json(ApiResponse.error(error.message));
    }
  };

  /**
   * 更新用户信息
   * @param req
   * @param res
   * @param next
   */
  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.body as UserEntity;
      await this.userService.updateUser(user);
      res.status(200).json(ApiResponse.success(user));
    } catch (error) {
      res.status(200).json(ApiResponse.error(error.message));
    }
  };

  /**
   * 删除用户
   * @param req
   * @param res
   * @param next
   */
  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(req.params.id);
      await this.userService.deleteUser(userId);
      res.status(200).json(ApiResponse.successWithoutData());
    } catch (error) {
      res.status(200).send(ApiResponse.error(error.message));
    }
  };
}
