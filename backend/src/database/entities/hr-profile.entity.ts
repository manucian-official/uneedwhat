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

@Entity('hr_profiles')
export class HRProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.hrProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  company: string;

  @Column({ nullable: true })
  department?: string;

  @Column()
  jobTitle: string;

  @Column({ nullable: true })
  companyLogo?: string;

  @Column({ nullable: true })
  companyWebsite?: string;

  @Column({ nullable: true })
  companySize?: string;

  @Column({ nullable: true })
  industry?: string;

  @Column({ nullable: true })
  verificationDocument?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column('simple-json', { nullable: true })
  teamMembers?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
