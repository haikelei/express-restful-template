import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import type { Routes } from "../interfaces/routes.interface";
import { authenticateUser } from "../middleware/authenticate.middleware";

export class UserRoute implements Routes {
  public path = "/api/vango";
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/users/login`, this.userController.login);
    this.router.get(
      `${this.path}/users/:id`,
      authenticateUser,
      this.userController.getUser
    );
    this.router.put(
      `${this.path}/users`,
      authenticateUser,
      this.userController.updateUser
    );
    this.router.post(
      `${this.path}/users/check-login`,
      authenticateUser,
      this.userController.checkLogin
    );
    this.router.delete(
      `${this.path}/users/:id`,
      authenticateUser,
      this.userController.deleteUser
    );
    this.router.post(
      `${this.path}/users/send-code`,
      this.userController.sendVerificationCode
    );
  }
}
