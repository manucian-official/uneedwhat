import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('login_attempts')
export class LoginAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  ipAddress: string;

  @Column({ default: false })
  success: boolean;

  @Column({ default: 'user' })
  attemptType: string;

  @CreateDateColumn()
  createdAt: Date;
}
