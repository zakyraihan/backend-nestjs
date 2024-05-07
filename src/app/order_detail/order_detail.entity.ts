import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/auth.entity';
import { Produk } from '../produk/produk.entity';
import { OrderEntity } from '../order/order.entity';

@Entity()
export class OrderDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double', precision: 18, scale: 2, nullable: true })
  jumlah_harga: number;

  @Column({ nullable: false })
  jumlah: number;

  @ManyToOne(() => Produk, (v) => v.order_detail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'produk_id' })
  produk: Produk;

  @ManyToOne(() => OrderEntity, (v) => v.order_detail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
