import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationMember } from './organization-member.entity';
import { Subscription } from './subscription.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrganizationMember, (m) => m.organization)
  members?: OrganizationMember[];

  @OneToOne(() => Subscription, (sub) => sub.organization)
  subscription?: Subscription;
}
