import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'job_opening_id' })
  jobOpeningId: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column({ name: 'call_number', nullable: true })
  callNumber: string;

  @Column({ nullable: true })
  pronoun: string;

  @Column({ nullable: true })
  role: string;

  @Column({ name: 'other_positions', nullable: true })
  otherPositions: string;

  @Column({ name: 'heard_about', nullable: true })
  heardAbout: string;

  @Column({ name: 'salary_agreement', nullable: true })
  salaryAgreement: boolean;

  @Column({ name: 'voice_recording_url', nullable: true })
  voiceRecordingUrl: string;

  @Column({ name: 'english_level', nullable: true })
  englishLevel: string;

  @Column({ nullable: true })
  seniority: string;

  @Column({ nullable: true })
  portfolio: string;

  @Column({ type: 'text', nullable: true })
  tools: string;

  @Column({ name: 'other_tools', type: 'text', nullable: true })
  otherTools: string;

  @Column({ type: 'text', nullable: true })
  references: string;

  @Column({ name: 'resume_url', nullable: true })
  resumeUrl: string;

  @Column({ name: 'voice_message_url', nullable: true })
  voiceMessageUrl: string;

  @Column({ name: 'cover_letter', nullable: true })
  coverLetter: string;

  @Column({ default: 'new' })
  status: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
