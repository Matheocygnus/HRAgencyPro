import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('job_requests')
export class JobRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column({ name: 'client_name', nullable: true })
  clientName: string;

  @Column({ name: 'company_name', nullable: true })
  companyName: string;

  @Column()
  title: string;

  @Column({ name: 'open_positions', default: 1 })
  openPositions: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  requirements: string;

  @Column({ name: 'nice_to_have_skills', type: 'text', nullable: true })
  niceToHaveSkills: string;

  @Column({ type: 'text', nullable: true })
  tools: string;

  @Column({ name: 'job_type' })
  jobType: string;

  @Column({ name: 'working_hours', nullable: true })
  workingHours: string;

  @Column({ name: 'timezone', nullable: true })
  location: string;

  @Column({ name: 'reports_to', type: 'text', nullable: true })
  reportsTo: string;

  @Column({ type: 'simple-array', nullable: true })
  languages: string[];

  @Column({ nullable: true })
  seniority: string;

  @Column({ name: 'requires_proficiency_test', default: false })
  requiresProficiencyTest: boolean;

  @Column({ name: 'interview_questions', type: 'text', nullable: true })
  interviewQuestions: string;

  @Column({ name: 'testing_requirements', type: 'text', nullable: true })
  testingRequirements: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
