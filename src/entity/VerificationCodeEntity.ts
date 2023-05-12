import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("verification_code")
export class VerificationCodeEntity extends BaseEntity {
  @Column({ type: "varchar", length: 11, comment: "手机号", nullable: false })
  phone: string;

  @Column({ type: "varchar", length: 6, comment: "验证码", nullable: false })
  code: string;
}
