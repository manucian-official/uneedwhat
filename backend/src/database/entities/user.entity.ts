import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './enums';
import { HRProfile } from './hr-profile.entity';
import { JobSeekerProfile } from './job-seeker-profile.entity';
import { Job } from './job.entity';
import { Application } from './application.entity';
import { Bookmark } from './bookmark.entity';
import { ActivityLog } from './activity-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar', default: UserRole.JOB_SEEKER })
  role: UserRole;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshTokenHash?: string;

  @Column({ type: 'datetime', nullable: true })
  lastLogin?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => HRProfile, (profile) => profile.user)
  hrProfile?: HRProfile;

  @OneToOne(() => JobSeekerProfile, (profile) => profile.user)
  jobSeekerProfile?: JobSeekerProfile;

  @OneToMany(() => Job, (job) => job.postedBy)
  jobs?: Job[];

  @OneToMany(() => Application, (app) => app.user)
  applications?: Application[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks?: Bookmark[];

  @OneToMany(() => ActivityLog, (log) => log.user)
  activityLogs?: ActivityLog[];
}
