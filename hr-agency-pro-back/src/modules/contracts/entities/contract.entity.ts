import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'hero_id' })
  heroId: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'double precision' })
  compensation: number;

  @Column({ default: 'draft' })
  status: string;

  @Column({ nullable: true })
  document: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'company_payment', type: 'double precision', nullable: true })
  companyPayment: number;

  @Column({ type: 'double precision', nullable: true })
  profit: number;
}
