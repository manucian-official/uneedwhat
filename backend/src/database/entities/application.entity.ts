import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationStatus } from './enums';
import { User } from './user.entity';
import { Job } from './job.entity';
import { Interview } from './interview.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  jobId: string;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', default: ApplicationStatus.SUBMITTED })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  coverLetter?: string;

  @Column('simple-json', { nullable: true })
  resume?: { url: string; fileName: string };

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  appliedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt?: Date;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column({ type: 'float', nullable: true })
  rating?: number;

  @Column({ type: 'datetime', nullable: true })
  scheduledInterviewAt?: Date;

  @Column('simple-json', { nullable: true })
  interviewFeedback?: Record<string, unknown>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Interview, (interview) => interview.application)
  interviews?: Interview[];
}
