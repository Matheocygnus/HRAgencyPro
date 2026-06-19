import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('prospects_database')
export class ProspectsDatabase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  status: string;

  @Column({ name: 'role_position', nullable: true })
  rolePosition: string;

  @Column({ name: 'other_role_of_interest', nullable: true })
  otherRoleOfInterest: string;

  @Column({ name: 'vocaroo_record', nullable: true })
  vocarooRecord: string;

  @Column({ nullable: true })
  resume: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'program_tools', nullable: true })
  programTools: string;

  @Column({ name: 'english_level', nullable: true })
  englishLevel: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'client_id', nullable: true })
  clientId: number;

  @Column({ name: 'company_id', nullable: true })
  companyId: number;
}
