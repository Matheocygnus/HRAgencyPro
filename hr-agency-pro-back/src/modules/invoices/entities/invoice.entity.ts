import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hero } from '../../heroes/entities/hero.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_number', unique: true })
  invoiceNumber: string;

  @Column({ name: 'contract_id', type: 'int', nullable: true })
  contractId: number;

  @Column({ name: 'hero_id' })
  heroId: number;

  @ManyToOne(() => Hero, { eager: false, nullable: true })
  @JoinColumn({ name: 'hero_id' })
  hero: Hero;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'paid_date', type: 'date', nullable: true })
  paidDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
