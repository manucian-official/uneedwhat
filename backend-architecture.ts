/**
 * UNEEDWHAT - Recruitment Platform Backend Architecture
 * Modern TypeScript/NestJS stack with role-based access and recruitment workflow
 * 
 * Project Structure:
 * src/
 *   ├── modules/
 *   │   ├── auth/          (JWT, OAuth, 2FA)
 *   │   ├── users/         (HR Professionals, Job Seekers)
 *   │   ├── jobs/          (Job postings, filtering, search)
 *   │   ├── applications/  (Application management & tracking)
 *   │   ├── profiles/      (Resume, skills, portfolio)
 *   │   ├── interviews/    (Interview scheduling, feedback)
 *   │   ├── notifications/ (Real-time alerts)
 *   │   └── analytics/     (Dashboard, metrics, insights)
 *   ├── common/
 *   │   ├── decorators/    (Custom decorators)
 *   │   ├── filters/       (Exception handling)
 *   │   ├── guards/        (Auth guards, role guards)
 *   │   ├── interceptors/  (Logging, transformation)
 *   │   └── pipes/         (Validation pipes)
 *   ├── database/
 *   │   ├── migrations/    (TypeORM migrations)
 *   │   └── seeds/         (Database seeding)
 *   └── config/            (Environment, database config)
 */

// ============================================================================
// 1. DATABASE ENTITIES & MODELS
// ============================================================================

// User Types Enum
export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  HR_PROFESSIONAL = 'hr_professional',
  RECRUITER = 'recruiter',
  ADMIN = 'admin',
}

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  SCREENING = 'screening',
  SHORTLISTED = 'shortlisted',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

// User Entity
export interface UserEntity {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  location?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// HR Professional Profile
export interface HRProfileEntity {
  id: string;
  userId: string;
  company: string;
  department?: string;
  jobTitle: string;
  companyLogo?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  verificationDocument?: string;
  isVerified: boolean;
  teamMembers?: string[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
}

// Job Seeker Profile
export interface JobSeekerProfileEntity {
  id: string;
  userId: string;
  headline?: string;
  bio?: string;
  resume?: {
    url: string;
    fileName: string;
    uploadedAt: Date;
  };
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  portfolio?: string;
  expectedSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  jobPreferences?: {
    jobTypes: string[];
    locations: string[];
    industries: string[];
    workplaceTypes: string[];
  };
  isOpenToWork: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  description?: string;
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
}

// Job Posting Entity
export interface JobEntity {
  id: string;
  postedByUserId: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
  workplaceType: 'on-site' | 'remote' | 'hybrid';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  status: JobStatus;
  postedAt: Date;
  deadline?: Date;
  skills: string[];
  experienceLevel: string;
  companyName: string;
  companyLogo?: string;
  applicationsCount: number;
  viewsCount: number;
  isBookmarked?: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Application Entity
export interface ApplicationEntity {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resume?: {
    url: string;
    fileName: string;
  };
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  feedback?: string;
  rating?: number;
  scheduledInterviewAt?: Date;
  interviewFeedback?: {
    interviewer: string;
    date: Date;
    notes: string;
    rating: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Interview Entity
export interface InterviewEntity {
  id: string;
  applicationId: string;
  scheduledBy: string;
  interviewerIds: string[];
  date: Date;
  duration: number; // minutes
  type: 'phone' | 'video' | 'in-person' | 'panel';
  meetingLink?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedbacks: InterviewFeedback[];
  createdAt: Date;
  updatedAt: Date;
}

interface InterviewFeedback {
  interviewerId: string;
  rating: number;
  notes: string;
  submittedAt: Date;
}

// Bookmark Entity
export interface BookmarkEntity {
  id: string;
  userId: string;
  jobId: string;
  createdAt: Date;
}

// Activity Log Entity (for analytics)
export interface ActivityLogEntity {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// ============================================================================
// 2. DTOs (Data Transfer Objects)
// ============================================================================

// Auth DTOs
export interface AuthRegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyName?: string;
  phoneNumber?: string;
}

export interface AuthLoginDto {
  email: string;
  password: string;
}

export interface AuthRefreshDto {
  refreshToken: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
}

// Job DTOs
export interface CreateJobDto {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  jobType: string;
  workplaceType: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  skills: string[];
  experienceLevel: string;
  deadline?: Date;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}

export interface JobFilterDto {
  search?: string;
  jobTypes?: string[];
  workplaceTypes?: string[];
  locations?: string[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  experienceLevel?: string;
  sortBy?: 'recent' | 'salary' | 'relevance';
  limit?: number;
  offset?: number;
}

export interface JobResponseDto {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryRange?: string;
  postedAt: Date;
  applicationsCount: number;
  isBookmarked: boolean;
}

// Application DTOs
export interface CreateApplicationDto {
  jobId: string;
  coverLetter?: string;
  resumeFileId?: string;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
  feedback?: string;
}

// Profile DTOs
export interface UpdateJobSeekerProfileDto {
  headline?: string;
  bio?: string;
  skills?: string[];
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  portfolio?: string;
  expectedSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  jobPreferences?: Record<string, any>;
  isOpenToWork?: boolean;
}

export interface UpdateHRProfileDto {
  company?: string;
  department?: string;
  jobTitle?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
}

// ============================================================================
// 3. CORE SERVICES INTERFACE
// ============================================================================

export interface IAuthService {
  register(dto: AuthRegisterDto): Promise<AuthResponseDto>;
  login(dto: AuthLoginDto): Promise<AuthResponseDto>;
  refreshToken(dto: AuthRefreshDto): Promise<AuthResponseDto>;
  validateToken(token: string): Promise<any>;
  logout(userId: string): Promise<void>;
}

export interface IUserService {
  getUserById(id: string): Promise<UserEntity>;
  getUserByEmail(email: string): Promise<UserEntity>;
  updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
  deleteUser(id: string): Promise<void>;
  searchUsers(query: string, role?: UserRole): Promise<UserEntity[]>;
}

export interface IJobService {
  createJob(userId: string, dto: CreateJobDto): Promise<JobEntity>;
  updateJob(jobId: string, dto: UpdateJobDto): Promise<JobEntity>;
  getJobById(id: string, userId?: string): Promise<JobEntity>;
  getAllJobs(filter: JobFilterDto): Promise<JobEntity[]>;
  getJobsByUser(userId: string): Promise<JobEntity[]>;
  closeJob(jobId: string): Promise<JobEntity>;
  deleteJob(jobId: string): Promise<void>;
  searchJobs(query: string, filters?: JobFilterDto): Promise<JobEntity[]>;
  getJobAnalytics(jobId: string): Promise<any>;
}

export interface IApplicationService {
  createApplication(userId: string, dto: CreateApplicationDto): Promise<ApplicationEntity>;
  updateApplicationStatus(appId: string, dto: UpdateApplicationStatusDto): Promise<ApplicationEntity>;
  getApplicationById(id: string): Promise<ApplicationEntity>;
  getApplicationsByJob(jobId: string): Promise<ApplicationEntity[]>;
  getApplicationsByUser(userId: string): Promise<ApplicationEntity[]>;
  getApplicationsForReview(userId: string): Promise<ApplicationEntity[]>;
  withdrawApplication(appId: string): Promise<void>;
  bulkUpdateApplications(jobId: string, appIds: string[], status: ApplicationStatus): Promise<void>;
}

export interface IProfileService {
  getJobSeekerProfile(userId: string): Promise<JobSeekerProfileEntity>;
  updateJobSeekerProfile(userId: string, dto: UpdateJobSeekerProfileDto): Promise<JobSeekerProfileEntity>;
  getHRProfile(userId: string): Promise<HRProfileEntity>;
  updateHRProfile(userId: string, dto: UpdateHRProfileDto): Promise<HRProfileEntity>;
  uploadResume(userId: string, file: Express.Multer.File): Promise<{ url: string; fileName: string }>;
}

export interface IInterviewService {
  scheduleInterview(
    applicationId: string,
    interviewerIds: string[],
    date: Date,
    type: string,
    meetingLink?: string,
  ): Promise<InterviewEntity>;
  getInterviewById(id: string): Promise<InterviewEntity>;
  updateInterviewStatus(id: string, status: string): Promise<InterviewEntity>;
  submitInterviewFeedback(interviewId: string, userId: string, rating: number, notes: string): Promise<InterviewEntity>;
  getUpcomingInterviews(userId: string): Promise<InterviewEntity[]>;
  cancelInterview(id: string, reason?: string): Promise<void>;
}

export interface IBookmarkService {
  bookmarkJob(userId: string, jobId: string): Promise<BookmarkEntity>;
  unbookmarkJob(userId: string, jobId: string): Promise<void>;
  getBookmarkedJobs(userId: string): Promise<JobEntity[]>;
  isJobBookmarked(userId: string, jobId: string): Promise<boolean>;
}

export interface IAnalyticsService {
  trackActivity(userId: string, action: string, entityType: string, entityId: string): Promise<void>;
  getJobSeekerDashboard(userId: string): Promise<any>;
  getHRDashboard(userId: string): Promise<any>;
  getJobMetrics(jobId: string): Promise<any>;
}

// ============================================================================
// 4. API ENDPOINTS STRUCTURE
// ============================================================================

/**
 * Auth Routes: POST /api/v1/auth
 *   - POST /register
 *   - POST /login
 *   - POST /refresh
 *   - POST /logout
 *   - POST /verify-email
 *   - POST /resend-verification
 *   - POST /forgot-password
 *   - POST /reset-password
 * 
 * Users Routes: GET/PATCH /api/v1/users
 *   - GET /:id
 *   - PATCH /:id
 *   - DELETE /:id
 *   - GET /search
 *   - GET /:id/recommendations
 * 
 * Jobs Routes: GET/POST /api/v1/jobs
 *   - POST / (create, requires HR role)
 *   - GET / (with filters)
 *   - GET /:id
 *   - PATCH /:id (update)
 *   - DELETE /:id
 *   - POST /:id/close
 *   - GET /:id/applications
 *   - GET /:id/analytics
 * 
 * Applications Routes: GET/POST /api/v1/applications
 *   - POST / (create application)
 *   - GET / (my applications)
 *   - GET /:id
 *   - PATCH /:id/status
 *   - DELETE /:id (withdraw)
 *   - GET /job/:jobId (for HR)
 *   - POST /bulk-update
 * 
 * Profiles Routes: GET/PATCH /api/v1/profiles
 *   - GET /job-seeker/:userId
 *   - PATCH /job-seeker
 *   - GET /hr/:userId
 *   - PATCH /hr
 *   - POST /resume (upload)
 * 
 * Interviews Routes: GET/POST /api/v1/interviews
 *   - POST / (schedule)
 *   - GET / (upcoming)
 *   - GET /:id
 *   - PATCH /:id/status
 *   - POST /:id/feedback
 *   - DELETE /:id (cancel)
 * 
 * Bookmarks Routes: GET/POST /api/v1/bookmarks
 *   - POST /jobs/:jobId
 *   - DELETE /jobs/:jobId
 *   - GET / (my bookmarks)
 * 
 * Analytics Routes: GET /api/v1/analytics
 *   - GET /dashboard (user dashboard)
 *   - GET /job/:jobId (job metrics)
 */

// ============================================================================
// 5. ERROR HANDLING & EXCEPTIONS
// ============================================================================

export class AppException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public metadata?: Record<string, any>,
  ) {
    super(message);
  }
}

export class ValidationException extends AppException {
  constructor(message: string, metadata?: Record<string, any>) {
    super(400, message, 'VALIDATION_ERROR', metadata);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = 'Access denied') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundException extends AppException {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
  }
}

// ============================================================================
// 6. TYPE SAFETY & UTILITIES
// ============================================================================

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    metadata?: Record<string, any>;
  };
  timestamp: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type ValidationRule = {
  field: string;
  rules: string[];
};

// ============================================================================
// 7. IMPLEMENTATION NOTES
// ============================================================================

/**
 * BACKEND STACK:
 * - NestJS 10+ (framework)
 * - TypeORM (database ORM)
 * - PostgreSQL or MongoDB (primary database)
 * - Redis (caching, sessions, job queue)
 * - Passport.js (authentication strategies)
 * - class-validator (validation)
 * - class-transformer (serialization)
 * - Multer (file uploads)
 * - Socket.io (real-time notifications)
 * - Bull (job queue for async tasks)
 * 
 * SECURITY FEATURES:
 * - JWT with refresh tokens
 * - Role-based access control (RBAC)
 * - Rate limiting (express-rate-limit)
 * - CORS configuration
 * - SQL injection prevention (parameterized queries)
 * - XSS protection
 * - CSRF tokens for state-changing operations
 * - Helmet.js for HTTP headers
 * - Password hashing with bcrypt
 * 
 * PERFORMANCE:
 * - Database indexing on frequently queried fields
 * - Redis caching for job listings, user data
 * - Pagination for large result sets
 * - Lazy loading of relationships
 * - Query optimization with joins
 * - Background job processing for heavy operations
 * 
 * SCALABILITY:
 * - Microservices-ready architecture
 * - Message queue for async operations
 * - WebSocket for real-time updates
 * - CDN for static assets
 * - Database replication
 * - Horizontal scaling support
 */
