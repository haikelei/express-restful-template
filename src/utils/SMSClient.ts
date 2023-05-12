import UniSMS from "unisms";
import { logger } from "./logger";

export class SMSClient {
  private client: UniSMS;
  private accessKeyId = "khEMPQD7v52pnPQ2uak7oFP6yAiBfXAb6sY4udG32fjLmnUdR";
  private accessKeySecret = "";

  constructor() {
    this.client = new UniSMS({
      accessKeyId: this.accessKeyId,
      accessKeySecret: this.accessKeySecret,
    });
  }

  async sendVerificationCode(phone: string, code: string) {
    try {
      const ret = await this.client.send({
        to: phone,
        signature: "天目新闻",
        templateId: "pub_verif_basic2",
        templateData: {
          code,
        },
      });
      return ret;
    } catch (error) {
      console.error(error);
      if (error.message === "LimitExceed") {
        throw new Error("发送验证码过于频繁，请稍后再试");
      } else if (error.message === "InsufficientFunds") {
        throw new Error("账户余额");
      } else if (error.message === "IpRestricted") {
        throw new Error("请求 IP 受限");
      } else if (error.message === "InvalidPhoneNumbers") {
        throw new Error("错误的手机号码");
      } else {
        throw error;
      }
    }
  }
}
