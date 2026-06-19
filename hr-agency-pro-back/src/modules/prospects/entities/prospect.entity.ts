import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { jsonTextTransformer } from '../../../common/transformers/json-text.transformer';

@Entity('prospects')
export class Prospect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  skills: string;

  @Column({ nullable: true })
  resume: string;

  @Column({ default: 'sourcing' })
  status: string;

  @Column({ name: 'client_id', nullable: true })
  clientId: number;

  @Column({ name: 'company_id', nullable: true })
  companyId: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_interviewed', default: false })
  isInterviewed: boolean;

  @Column({ name: 'is_client_approved', default: false })
  isClientApproved: boolean;

  @Column({ name: 'is_budget_agreed', default: false })
  isBudgetAgreed: boolean;

  @Column({ name: 'voice_message_url', nullable: true })
  voiceMessageUrl: string;

  @Column({
    name: 'notes_history',
    type: 'text',
    nullable: true,
    transformer: jsonTextTransformer,
  })
  notesHistory: any[];

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;
}
