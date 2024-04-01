import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../auths/auths.entity';

@Entity()
export class Books {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'created_by' })
  created_by: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'updated_by' })
  updated_by: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'delete_by' })
  delete_by: Users;

  @Column({ default: false })
  is_deleted: boolean;

  @Column()
  judul: string;

  @Column({ nullable: true })
  cover: string;

  @Column()
  tahun_terbit: number;

  @Column()
  harga: number;

  @Column()
  penulis: string;

  @Column('text')
  deskripsi: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
