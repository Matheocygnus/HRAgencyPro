import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'prospect_id' })
  prospectId: number;

  @Column()
  title: string;

  @Column({ name: 'scheduled_date', type: 'timestamptz' })
  scheduledDate: Date;

  @Column({ type: 'int' })
  duration: number;

  @Column({ name: 'meeting_link', nullable: true })
  meetingLink: string;

  @Column({
    type: 'simple-json',
    name: 'interviewer_ids',
    nullable: true,
    default: '[]',
  })
  interviewerIds: number[];

  @Column({ nullable: true })
  notes: string;

  @Column({ default: 'scheduled' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
