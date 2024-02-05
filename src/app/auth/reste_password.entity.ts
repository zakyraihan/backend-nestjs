import { Entity,BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./auth.entity";

@Entity()
export class ResetPassword extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(() => User)
    @JoinColumn({name : 'user_id'})
    user :  User;

    @Column({nullable : true})
    token : string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}