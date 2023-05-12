// BaseEntity.ts
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ comment: "创建时间" })
  createTime: Date;

  @UpdateDateColumn({ comment: "更新时间" })
  updateTime: Date;
}
