import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('job_openings')
export class JobOpening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  requirements: string;

  @Column()
  location: string;

  @Column({ name: 'job_type' })
  jobType: string;

  @Column({ type: 'text', nullable: true })
  salary: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  status: 'active' | 'closed';

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  computeStatus() {
    this.status = this.isActive ? 'active' : 'closed';
  }

  @Column({ name: 'client_id', nullable: true })
  clientId: number;

  @Column({ name: 'company_id', nullable: true })
  companyId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
