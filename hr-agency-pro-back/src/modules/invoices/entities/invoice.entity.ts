import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
