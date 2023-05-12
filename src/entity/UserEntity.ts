import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("user")
export class UserEntity extends BaseEntity {
  @Column({ type: "varchar", length: 50, comment: "用户昵称", nullable: true })
  username: string;

  @Column({ type: "varchar", length: 50, comment: "用户邮箱", nullable: true })
  email: string;

  @Column({ type: "varchar", length: 20, comment: "用户手机号" })
  phone: string;

  @Column({ type: "varchar", length: 100, comment: "密码", nullable: true })
  password: string;

  @Column({ type: "varchar", length: 256, comment: "头像", nullable: true })
  avatar: string;
}
