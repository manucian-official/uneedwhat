import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InterviewStatus, InterviewType } from './enums';
import { Application } from './application.entity';

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationId: string;

  @ManyToOne(() => Application, (app) => app.interviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @Column()
  scheduledBy: string;

  @Column('simple-json', { default: '[]' })
  interviewerIds: string[];

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ default: 60 })
  duration: number;

  @Column({ type: 'varchar', default: InterviewType.VIDEO })
  type: InterviewType;

  @Column({ nullable: true })
  meetingLink?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'varchar', default: InterviewStatus.SCHEDULED })
  status: InterviewStatus;

  @Column('simple-json', { default: '[]' })
  feedbacks: { interviewerId: string; rating: number; notes: string; submittedAt: Date }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
