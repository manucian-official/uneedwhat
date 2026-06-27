import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobStatus } from './enums';
import { User } from './user.entity';
import { Application } from './application.entity';
import { Bookmark } from './bookmark.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postedByUserId: string;

  @ManyToOne(() => User, (user) => user.jobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postedByUserId' })
  postedBy: User;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-json', { default: '[]' })
  requirements: string[];

  @Column('simple-json', { default: '[]' })
  responsibilities: string[];

  @Column()
  location: string;

  @Column()
  jobType: string;

  @Column()
  workplaceType: string;

  @Column({ type: 'float', nullable: true })
  salaryMin?: number;

  @Column({ type: 'float', nullable: true })
  salaryMax?: number;

  @Column({ default: 'USD' })
  salaryCurrency: string;

  @Column({ type: 'varchar', default: JobStatus.ACTIVE })
  status: JobStatus;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  postedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  deadline?: Date;

  @Column('simple-json', { default: '[]' })
  skills: string[];

  @Column()
  experienceLevel: string;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  companyLogo?: string;

  @Column({ default: 0 })
  applicationsCount: number;

  @Column({ default: 0 })
  viewsCount: number;

  @Column('simple-json', { default: '[]' })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Application, (app) => app.job)
  applications?: Application[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.job)
  bookmarks?: Bookmark[];
}
