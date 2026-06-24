import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Hero } from '../../heroes/entities/hero.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'hero_id' })
  heroId: number;

  @ManyToOne(() => Hero, { eager: false, nullable: true })
  @JoinColumn({ name: 'hero_id' })
  hero: Hero;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @ManyToOne(() => Company, { eager: false, nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'length_months', type: 'int', nullable: true })
  lengthMonths: number;

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
