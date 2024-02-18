import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Kategori } from '../kategori/kategori.entity';
import { User } from '../auth/auth.entity';

@Entity()
export class Produk extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  barcode: string;

  @ManyToOne(() => Kategori)
  @JoinColumn({ name: 'kategori_id' })
  kategori: Kategori;

  @Column({ nullable: false })
  nama_produk: string;

  @Column({ nullable: false })
  deskripsi_produk: string;

  @Column({ type: 'double', precision: 18, scale: 2, nullable: false })
  harga: number;

  @Column()
  stok: number;

  @Column({ nullable: true })
  foto: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
  order_detail: any;
}
