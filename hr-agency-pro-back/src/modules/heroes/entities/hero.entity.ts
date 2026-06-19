import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prospect } from '../../prospects/entities/prospect.entity';

@Entity('heroes')
export class Hero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'prospect_id' })
  prospectId: number;

  @ManyToOne(() => Prospect, { eager: false, nullable: true })
  @JoinColumn({ name: 'prospect_id' })
  prospect: Prospect;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'contract_id', nullable: true })
  contractId: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
