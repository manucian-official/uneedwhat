import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('job_seeker_profiles')
export class JobSeekerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.jobSeekerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  headline?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column('simple-json', { nullable: true })
  resume?: { url: string; fileName: string; uploadedAt: Date };

  @Column('simple-json', { default: '[]' })
  skills: string[];

  @Column('simple-json', { default: '[]' })
  experience: Record<string, unknown>[];

  @Column('simple-json', { default: '[]' })
  education: Record<string, unknown>[];

  @Column({ nullable: true })
  portfolio?: string;

  @Column('simple-json', { nullable: true })
  expectedSalary?: { min: number; max: number; currency: string };

  @Column('simple-json', { nullable: true })
  jobPreferences?: Record<string, unknown>;

  @Column({ default: true })
  isOpenToWork: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
