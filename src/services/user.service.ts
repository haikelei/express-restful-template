import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { UserEntity } from "../entity/UserEntity";
import { VerificationCodeEntity } from "../entity/VerificationCodeEntity";
import { SECRET_KEY } from "../utils/constant";
import { SMSClient } from "../utils/SMSClient";

export class UserService {
  public smsClient = new SMSClient();

  private generateToken(user: UserEntity) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresIn = 30 * 24 * 60 * 60; // 30 天的秒数
    const exp = issuedAt + expiresIn;
    return jwt.sign(
      {
        userId: user.id,
        userPhone: user.phone,
        iat: issuedAt,
        exp,
      },
      SECRET_KEY
    );
  }

  async loginUser(phone: string, verificationCode: string) {
    const verificationCodeEntityRepository = getRepository(
      VerificationCodeEntity
    );
    // 检查手机号和验证码是否匹配
    const existingCode = await verificationCodeEntityRepository.findOne({
      where: { phone, code: verificationCode },
    });
    // 如果existingCode不存在，说明验证码不正确
    if (!existingCode) {
      throw new Error("验证码不正确");
    }

    const userRepo = getRepository(UserEntity);
    let user = await userRepo.findOne({ where: { phone } });
    // 如果手机号不存在,则添加该用户到数据库
    if (!user) {
      user = new UserEntity();
      user.phone = phone;
      user = await userRepo.save(user);
    }
    const token = this.generateToken(user);
    return { ...user, token };
  }

  async getUserById(id: number) {
    const userRepo = getRepository(UserEntity);
    return await userRepo.findOne({ where: { id } });
  }

  async updateUser(user: UserEntity) {
    const userRepo = getRepository(UserEntity);
    await userRepo.save(user);
  }

  async deleteUser(userId: number) {
    const userRepo = getRepository(UserEntity);
    await userRepo.delete({ id: userId });
  }

  async sendVerificationCode(phone: string) {
    // 生成6位随机验证码
    const code = this.generateRandomCode(6);
    const verificationCodeEntityRepository = getRepository(
      VerificationCodeEntity
    );
    const verificationCodeEntity = new VerificationCodeEntity();
    verificationCodeEntity.code = code;
    verificationCodeEntity.phone = phone;
    await verificationCodeEntityRepository.save(verificationCodeEntity);
    await this.smsClient.sendVerificationCode(phone, code);
  }

  generateRandomCode(length) {
    let code = "";
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return code;
  }
}
