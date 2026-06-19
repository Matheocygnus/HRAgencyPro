import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'token_hash' })
  tokenHash: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ default: false })
  revoked: boolean;

  @Column({ name: 'replaced_by_token_hash', nullable: true })
  replacedByTokenHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
