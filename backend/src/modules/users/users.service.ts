import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Like, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { HRProfile } from '../../database/entities/hr-profile.entity';
import { JobSeekerProfile } from '../../database/entities/job-seeker-profile.entity';
import { UserRole } from '../../database/entities/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(HRProfile) private hrRepo: Repository<HRProfile>,
    @InjectRepository(JobSeekerProfile)
    private seekerRepo: Repository<JobSeekerProfile>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async create(data: Partial<User>) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async createHRProfile(
    userId: string,
    data: { company: string; jobTitle: string },
  ) {
    return this.hrRepo.save(
      this.hrRepo.create({
        userId,
        company: data.company,
        jobTitle: data.jobTitle,
      }),
    );
  }

  async createJobSeekerProfile(
    userId: string,
    data: Partial<JobSeekerProfile>,
  ) {
    return this.seekerRepo.save(
      this.seekerRepo.create({
        userId,
        skills: data.skills || [],
        experience: data.experience || [],
        education: data.education || [],
        isOpenToWork: data.isOpenToWork ?? true,
      }),
    );
  }

  async updateLastLogin(id: string) {
    await this.usersRepo.update(id, { lastLogin: new Date() });
  }

  async setRefreshToken(id: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersRepo.update(id, { refreshTokenHash: hash });
  }

  async clearRefreshToken(id: string) {
    await this.usersRepo.update(id, { refreshTokenHash: undefined });
  }

  async findOne(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, refreshTokenHash, ...safe } = user;
    return safe;
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, data);
    const saved = await this.usersRepo.save(user);
    const { passwordHash, refreshTokenHash, ...safe } = saved;
    return safe;
  }

  async remove(id: string) {
    await this.usersRepo.softDelete(id);
    return { message: 'User deleted' };
  }

  async search(query: string, role?: UserRole) {
    const where: Record<string, unknown> = {
      firstName: Like(`%${query}%`),
    };
    if (role) where.role = role;
    const users = await this.usersRepo.find({ where, take: 20 });
    return users.map(({ passwordHash, refreshTokenHash, ...safe }) => safe);
  }
}
